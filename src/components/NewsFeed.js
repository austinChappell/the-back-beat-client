import React, { Component } from 'react';
import { connect } from 'react-redux';

class NewsFeed extends Component {

  // componentDidMount() {
  //   const url = this.props.apiURL;
  //   fetch(`${url}/api/events/city/${this.props.loggedInUser.city}`, {
  //     credentials: 'include',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then((response) => {
  //     return response.json();
  //   }).then((results) => {
  //     if (results.rows) {
  //       this.props.loadEvents(results.rows);
  //     }
  //   })
  // }

  render() {
    return (
      <div className="CenterComponent">
        The NewsFeed Component
        {this.props.allEventsInCity.map((event, index) => {
          return (
            <div key={index} className="event">
              Hello
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
    apiURL: state.apiURL
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
