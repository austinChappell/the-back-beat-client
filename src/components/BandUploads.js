import React, { Component } from 'react';
import { connect } from 'react-redux';

import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Song from './Song';
import TextField from 'material-ui/TextField';

class BandUploads extends Component {

  constructor(props) {
    super(props);

    const bandId = props.bandId;

    this.state = {
      bandAdminId: null,
      bandCharts: [],
      bandInfoArr: [],
      chartFilter: -1,
      charTitle: '',
      currentPDF: null,
      currentPdfInstrumentId: -1,
      showCharModal: false,
      songTitle: ''
    }

  }

  componentDidMount() {
    // this.getCharts();
    this.getMembers();
  }

  componentWillReceiveProps() {
    this.setDefaultChartFilter();
    if (this.props.songId) {
      this.getSongTitle(this.props.songId);
    }
  }

  addChart = (evt) => {
    evt.preventDefault();
    const apiURL = this.props.apiURL;
    const bandId = this.props.bandId;
    fetch(`${apiURL}/band/upload/pdf/${bandId}?token=${localStorage.token}`, {
      credentials: 'include',
      encoding: null,
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'POST',
      body: JSON.stringify({
        title: this.state.chartTitle,
        pdf: this.state.currentPdf,
        instrument_id: this.state.currentPdfInstrumentId,
        song_id: this.props.songId
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.displayChartModal(false);
      this.getCharts();
    }).catch((err) => {
      console.log('error', err);
    })
  }

  assignChartInstrument = (evt, index, value) => {
    this.setState({ currentPdfInstrumentId: value });
  }

  displayChartModal = (show) => {
    this.setState({ showCharModal: show });
  }

  displayPreview = (url) => {
    window.open(url, '_blank');
  }

  filterCharts = (evt, index, value) => {
    console.log('evt', evt);
    console.log('index', index);
    console.log('value', value);
    this.setState({ chartFilter: value });
  }

  getCharts = () => {
    const apiURL = this.props.apiURL;
    const bandId = this.props.bandId;
    const url = `${apiURL}/api/band/charts/pdf/${bandId}?token=${localStorage.token}`;
    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bandCharts: results.rows });
    }).catch((err) => {
      console.log('getCharts error', err);
    })
  }

  getMembers = () => {
    const apiURL = this.props.apiURL;
    const bandId = this.props.bandId;
    fetch(`${apiURL}/api/band/${bandId}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      let members = [];
      results.rows.forEach((item) => {
        const member = {};
        member.id = item.id;
        member.instrument_id = item.instrument_id;
        members.push(member);
      })
      this.setState({ bandInfoArr: results.rows, members }, () => {
        this.setDefaultChartFilter();
      });
      this.setState({ bandAdminId: results.rows[0].band_admin_id });
    })
  }

  getSongTitle = (songId) => {
    let output;
    this.props.songs.forEach((song) => {
      if (song.id === songId) {
        output = song.title;
      }
    })
    this.setState({ songTitle: output })
  }

  handleInputChange = (val) => {
    this.setState({ chartTitle: val });
  }

  handleFileChange = (evt) => {
    const self = this;
    // this.setState({ currentPdf: evt.target.files[0].name });
    let reader = new FileReader();
    reader.onload = function (event) {
      self.setState({ currentPdf: event.currentTarget.result });
    };
    reader.readAsBinaryString(evt.target.files[0]);
  }

  setDefaultChartFilter = () => {
    if (this.state.bandInfoArr.length > 0) {
      let bandData = this.state.bandInfoArr[0];
      let bandAdmin = this.props.loggedInUser.id === bandData.band_admin_id;
      if (!bandAdmin) {
        let user = this.state.members.filter((member) => {
          return member.id === this.props.loggedInUser.id;
        })[0];
        console.log('USER', user);
        this.setState({ chartFilter: user.instrument_id });
      } else {
        this.setState({ chartFilter: -1 });
      }
    }
  }

  render() {

    console.log('BAND UPLOADS STATE', this.state);

    let addCharts;
    let bandData;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.displayChartModal(false)}
      />,
      <FlatButton
        disabled={this.state.messages === ''}
        label="Submit"
        primary={true}
        onClick={(evt) => this.addChart(evt)}
      />,
    ];

    if (this.state.bandInfoArr.length > 0) {
      bandData = this.state.bandInfoArr[0];
      addCharts = this.props.loggedInUser.id === bandData.band_admin_id ?
        <div
          className="band-chart add-chart"
          onClick={() => this.displayChartModal(true)}
        >
          <FloatingActionButton
            secondary={true}
          >
            <ContentAdd />
          </FloatingActionButton>
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.showCharModal}
            onRequestClose={() => this.displayChartModal(false)}
          >
            <TextField
              floatingLabelText="Chart Title"
              floatingLabelStyle={{ textAlign: 'left' }}
              onChange={(evt) => this.handleInputChange(evt.target.value)}
              value={this.state.chartTitle}
            />
            <SelectField
              floatingLabelText="Assign Instrument"
              onChange={this.assignChartInstrument}
              style={{textAlign: 'left', width: '250px'}}
              value={this.state.currentPdfInstrumentId}
            >
              <MenuItem
                key={-1}
                value={-1}
                primaryText={'All Instruments'}
              />
              {this.props.bandInstruments.map((instrument, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={instrument.instrument_id}
                    primaryText={instrument.name}
                  />
                )
              })}
            </SelectField>
            <input type="file" accept=".pdf" onChange={(evt) => this.handleFileChange(evt)} />
          </Dialog>
        </div>
      : null;
    }

    return (
      <div className="BandUploads">

        <SelectField
          floatingLabelText="Filter By Instrument"
          onChange={this.filterCharts}
          style={{textAlign: 'left', width: '250px'}}
          value={this.state.chartFilter}
        >
          <MenuItem
            key={-1}
            value={-1}
            primaryText={'All Charts'}
          />
          {this.props.bandInstruments.map((instrument, index) => {
            return (
              <MenuItem
                key={index}
                value={instrument.instrument_id}
                primaryText={instrument.name}
              />
            )
          })}
        </SelectField>

        <div className="charts">
          {addCharts}
          {this.props.charts.map((chart, index) => {
            const thumbnail = chart.url.slice(0, chart.url.length - 4) + '.png';
            if (this.state.chartFilter === -1 || chart.instrument_id === this.state.chartFilter || chart.instrument_id === -1) {
              return (
                <div
                  className="band-chart"
                  key={index}
                  onClick={() => this.displayPreview(chart.url)}
                >
                  <h2>{this.state.songTitle}</h2>
                  <img src={thumbnail} alt={chart.chart_title} />
                </div>
              )
            }
          })}
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    bandInstruments: state.bandInstruments,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandUploads)
