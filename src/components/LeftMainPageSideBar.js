import React, { Component } from 'react';
import { connect } from 'react-redux';

import BandBox from './BandBox';
import GigBox from './GigBox';
import RehearsalBox from './RehearsalBox';

class LeftMainPageSideBar extends Component {

  componentDidMount() {
    this.getMyEvents('Gig');
    this.getMyEvents('Rehearsal');
  }

  getMyEvents = (type) => {
    console.log('TYPE', type);
    const url = this.props.apiURL;
    console.log('URL', url);
    fetch(`${url}/api/my_band_events/${type}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      if (type === 'Gig') {
        this.props.setGigs(results.rows);
      } else if (type === 'Rehearsal') {
        this.props.setRehearsals(results.rows);
      }
    })
  }

  render() {
    return (
      <div className="LeftMainPageSideBar">
        <GigBox />
        <RehearsalBox />
        <BandBox />
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

    setGigs: (gigs) => {
      const action = { type: 'SET_GIGS', gigs };
      dispatch(action);
    },

    setRehearsals: (rehearsals) => {
      const action = { type: 'SET_REHEARSALS', rehearsals };
      dispatch(action);
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftMainPageSideBar);
