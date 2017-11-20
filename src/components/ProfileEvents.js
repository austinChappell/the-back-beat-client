import React, { Component } from 'react';
import { connect } from 'react-redux';

import EventList from './EventList';

class ProfileEvents extends Component {

  state = {
    eventList: [],
    userEvents: []
  }

  componentDidMount() {
    this.fetchUserEvents();
  }

  fetchUserEvents = () => {
    const url = this.props.apiURL;
    const userid = this.props.currentUser.id;
    console.log('USER ID', userid);
    fetch(`${url}/api/events/attending/${userid}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      console.log('RESPONSE', response);
      return response.json();
    }).then((results) => {
      console.log('RESULTS', results.rows);
      this.setState({ userEvents: results.rows }, () => {
        this.state.userEvents.map((event) => {
          this.fetchEventDetails(event.event_id);
        })
      });
    })
  }

  fetchEventDetails = (id) => {
    const url = this.props.apiURL;
    fetch(`${url}/api/event/${id}/details?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ eventList: this.state.eventList.concat(results.rows) });
    })
  }

  render() {

    return (
      <div className="ProfileEvents">
        <EventList
          data={this.state.eventList}
          url="event"
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEvents);
