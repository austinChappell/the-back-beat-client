import React, { Component } from 'react';
import { connect } from 'react-redux';

import BandUploads from './BandUploads';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SideBar from './SideBar';
import TextField from 'material-ui/TextField';

import Helpers from '../assets/functions/Helpers';

class BandUploads2 extends Component {

  constructor(props) {
    super(props);

    const bandId = props.match.params.bandId;

    this.state = {
      bandAdminId: null,
      charts: [],
      showDialog: false,
      sideBarLinks: [
        { title: 'Band Info', path: `/band/${bandId}` },
        { title: 'Dashboard', path: `/band/${bandId}/dashboard` },
        { title: 'Calendar', path: `/band/${bandId}/calendar` },
        { title: 'Uploads', path: `/band/${bandId}/uploads` },
        { title: 'Chat', path: `/band/${bandId}/chat` }
      ],
      songId: null,
      songs: [],
      songTitle: '',
    }

  }

  componentDidMount() {
    this.getSongs();
  }

  addSong() {
    console.log('ADDING SONG');
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;

    fetch(`${apiURL}/api/band/${bandId}/song?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        title: this.state.songTitle
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.getSongs();
    }).catch((err) => {
      console.error('ADD SONG ERROR', err);
    })
  }

  clearAllDialogContent = () => {
    this.setState({ showSongDialog: false })
  }

  getCharts = (songId) => {
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    const url = `${apiURL}/api/band/charts/pdf/${bandId}/song/${songId}?token=${localStorage.token}`;
    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ charts: results.rows });
    }).catch((err) => {
      console.error('GET CHARTS ERROR', err);
    })
  }

  getSongs = () => {
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;

    fetch(`${apiURL}/api/band/${bandId}/song?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      const songs = results.rows.slice();
      Helpers.sortObjectsByKey(songs, 'title', 1);
      this.setState({ songs });
    }).catch((err) => {
      console.error('GET SONGS ERROR', err);
    })
  }

  handleInputChange = (val, stateKey) => {
    const o = {};
    o[stateKey] = val;
    this.setState(o);
  }

  showSong = (id) => {
    this.getCharts(id);
    this.setState({ songId: id });
  }

  showSongDialog = () => {
    console.log('SHOWING SONG DIALOG');
    this.setState({ showSongDialog: true });
    this.toggleModal(true);
  }

  submitDialog = () => {
    if (this.state.showSongDialog) {
      this.addSong();
    }
    this.toggleModal(false);
    this.clearAllDialogContent();
  }

  toggleModal = (show) => {
    this.setState({ showDialog: show });
    if (!show) {
      this.clearAllDialogContent();
    }
  }

  render() {

    console.log('BAND UPLOADS 2 STATE', this.state);

    let dialogContent;

    if (this.state.showSongDialog) {
      dialogContent = <div>
        <TextField
          floatingLabelText="Chart Title"
          floatingLabelStyle={{ textAlign: 'left' }}
          onChange={(evt) => this.handleInputChange(evt.target.value, 'songTitle')}
          value={this.state.songTitle}
        />
      </div>
    }

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.toggleModal(false)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={(evt) => this.submitDialog(evt)}
      />,
    ];

    return (
      <div className="BandUploads2">
        <SideBar
          links={this.state.sideBarLinks}
          url={this.props.match.url}
        />

        <div className="band-songs">
          <button
            onClick={this.showSongDialog}
          >Add Song</button>
          <div className="song-display">
            {this.state.songs.map((song, index) => {
              return (
                <div
                  className="song"
                  key={index}
                  onClick={() => this.showSong(song.id)}
                >
                  <h2>{song.title}</h2>
                </div>
              )
            })}
          </div>
        </div>

        <BandUploads
          bandId={this.props.match.params.bandId}
          charts={this.state.charts}
          songId={this.state.songId}
          songs={this.state.songs}
        />

        <Dialog
          actions={actions}
          modal={false}
          open={this.state.showDialog}
          onRequestClose={() => this.toggleModal(false)}
        >
          {dialogContent}
        </Dialog>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandUploads2);
