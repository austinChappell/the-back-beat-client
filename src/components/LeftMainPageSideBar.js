import React, { Component } from 'react';
import { connect } from 'react-redux';

import BandBox from './BandBox';
import BandEventBox from './BandEventBox';

class LeftMainPageSideBar extends Component {

  state = {
    eventIndex: 0,
    eventIndexRange: [0, 1],
    eventOffset: 0
  }

  componentDidMount() {
    this.getMyEvents('Gig');
    this.getMyEvents('Rehearsal');
    // setTimeout(() => {
      this.loadEvents();
    // }, 1000);
  }

  getMyEvents = (type) => {
    const url = this.props.apiURL;
    const limit = 'nolimit';
    fetch(`${url}/api/my_band_events/${type}/${limit}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

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

  loadEvents = () => {
    const url = this.props.apiURL;
    console.log('LOAD EVENTS RUNNING URL', url);
    console.log('CITY', this.props.loggedInUser.city);
    fetch(`${url}/api/events/city/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      console.log('RESPONSE', response);
      return response.json();
    }).then((results) => {
      console.log('RESULTS', results);
      console.log('EVENTS', results.rows);
      if (results.rows) {
        this.props.loadEvents(results.rows);
        this.setState({ loading: false });
      }
    })
  }

  render() {
    return (
      <div className="LeftMainPageSideBar">

        <BandEventBox
          events={this.props.allEventsInCity}
          urlpath="event"
          title="Local Shows"
          type="event"
        />

        <BandEventBox
          events={this.props.gigs}
          title="Upcoming Gigs"
          urlpath="band_event"
          type="gig"
        />

        <BandEventBox
          events={this.props.rehearsals}
          title="Upcoming Rehearsals"
          urlpath="band_event"
          type="rehearsal"
        />

        <BandBox />

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allEventsInCity: state.allEventsInCity,
    apiURL: state.apiURL,
    gigs: state.gigs,
    loggedInUser: state.loggedInUser,
    rehearsals: state.rehearsals
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    loadEvents: (events) => {
      const action = {type: 'LOAD_EVENTS', events};
      dispatch(action);
    },

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
