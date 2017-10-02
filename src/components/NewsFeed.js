import React, { Component } from 'react';
import { connect } from 'react-redux';

class NewsFeed extends Component {

  state = {
    loading: true
  }

  componentDidMount() {
    setInterval(() => {
      this.loadEvents();
    }, 5000);
  }

  loadEvents = () => {
    const url = this.props.apiURL;
    fetch(`${url}/api/events/city/${this.props.loggedInUser.city}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('EVENTS', results.rows);
      if (results.rows) {
        this.props.loadEvents(results.rows);
        this.setState({ loading: false });
      }
    })
  }

  render() {

    let loadingMessage = this.state.loading ? <p>Loading Newsfeed...</p> : null;

    return (
      <div className="CenterComponent">
        {loadingMessage}
        {this.props.allEventsInCity.map((event, index) => {
          return (
            <div key={index} className="event">
              <p>{event.event_type} - {event.event_title} on {event.event_date_time} at {event.event_location}.</p>
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allEventsInCity: state.allEventsInCity,
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadEvents: (events) => {
      const action = {type: 'LOAD_EVENTS', events};
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
