import React, { Component } from 'react';
import { connect } from 'react-redux';

import MusicianCarousel from './MusicianCarousel';

class BandPageBrowseMusicians extends Component {

  state = {
    bandInfo: {},
    instruments: [],
    instrumentOptions: [],
    pendingInstrument: {},
    searchResults: [],
    skillIndexArray: [],
  }

  componentDidMount() {
    const url = this.props.apiURL;
    const bandId = this.props.match.params.bandId;

    fetch(`${url}/api/instruments`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('INSTRUMENT RESULTS', results);
      this.setState({
        instrumentOptions: results.rows,
        pendingInstrument: {
          value: results.rows[0].name,
          id: results.rows[0].instrument_id
        }
      }, () => {
        console.log('STATE AFTER MOUNT', this.state);
      })
    })

    fetch(`${url}/api/band/${bandId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bandInfo: results.rows[0] });
    })

  }

  componentDidUpdate() {

    const bandInfo = this.state.bandInfo;
    let skillIndex;

    if (bandInfo.band_skill_level) {

      skillIndex = this.findSkillIndex();
      let skillIndexArray;

      if (skillIndex === 0) {
        skillIndexArray = [skillIndex, skillIndex + 1];
      } else if (skillIndex === this.props.skillLevels.length - 1) {
        skillIndexArray = [skillIndex, skillIndex - 1];
      } else {
        skillIndexArray = [skillIndex, skillIndex + 1, skillIndex - 1];
      }

      this.setState({ skillIndexArray });

    }

  }

  findSkillIndex = () => {
    return this.props.skillLevels.indexOf(this.state.bandInfo.band_skill_level);
  }

  fetchUsersByInstrumentId = (instrumentId) => {
    const url = this.props.apiURL;
    const city = this.state.bandInfo.band_city;
    const searchResults = [];

    this.state.skillIndexArray.forEach((skillIndex) => {

      fetch(`${url}/api/users/${instrumentId}/${city}/${skillIndex}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((results) => {
        console.log('USER RESULTS', results.rows);
        searchResults.concat(results.rows);
      }).then(() => {
        this.setState({ searchResults });
      })

    })

  }

  filterSearch = (evt) => {
    if (evt.target.value !== '') {
      const instrumentId = evt.target.children[evt.target.selectedIndex].id;
      this.fetchUsersByInstrumentId(instrumentId);
    }
  }

  render() {

    const bandInfo = this.state.bandInfo;
    let instrumentOptions;

    if (bandInfo.band_admin_id !== undefined && bandInfo.band_admin_id != this.props.match.params.adminId) {
      this.props.history.goBack();
    }

    if (this.props.loggedInUser.id != this.props.match.params.adminId) {
      this.props.history.goBack();
    }

    if (this.state.instrumentOptions.length > 0) {
      instrumentOptions = this.state.instrumentOptions.map((option) => {
        return (
          <option key={option.instrument_id} id={option.instrument_id} value={option.name}>{option.name}</option>
        )
      })
    }

    return (

      <div className="BandPageBrowseMusicians">
        <h1>Search for musicians in {bandInfo.band_city} to join {bandInfo.band_name}.</h1>

        <label>Filter by instrument:</label>
        <select onChange={(evt) => this.filterSearch(evt)}>
          <option value="">---</option>
          {instrumentOptions}
        </select>

        <MusicianCarousel />
      </div>

    )

  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser,
    skillLevels: state.skillLevels
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandPageBrowseMusicians);
