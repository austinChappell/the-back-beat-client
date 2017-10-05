import React, { Component } from 'react';
import { connect } from 'react-redux';

import BandBox from './BandBox';
import BandEventBox from './BandEventBox';

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
        <BandEventBox
          events={this.props.gigs}
          title="Upcoming Gigs"
          type="gig"
        />
        <BandEventBox
          events={this.props.rehearsals}
          title="Upcoming Rehearsals"
          type="rehearsal"
        />
        <BandBox />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    gigs: state.gigs,
    rehearsals: state.rehearsals
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
