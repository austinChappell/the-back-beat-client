import React, { Component } from 'react';
import { connect } from 'react-redux';

class NewsFeed extends Component {

  state = {
    loading: true,
  }

  componentDidMount() {
    setTimeout(() => {
      this.loadEvents();
      setInterval(() => {
        this.loadEvents();
      }, 15000);
    }, 1000);
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

  handleAttendance = (evt) => {
    console.log('Hovering', evt.target.classList);
    if (evt.target.classList.contains('yes')) {
      evt.target.classList.add('selected');
      evt.target.nextElementSibling.style.display = 'none';
    } else if (evt.target.classList.contains('no')) {
      evt.target.classList.add('selected');
      evt.target.previousElementSibling.style.display = 'none';
    }
  }

  render() {

    let loadingMessage = this.state.loading ? <p>Loading Newsfeed...</p> : null;

    return (
      <div className="NewsFeed">
        {loadingMessage}
        {this.props.allEventsInCity.map((event, index) => {

          let date = event.event_date_time;
          let formattedDate = String(new Date(date));
          let shortDate = `${formattedDate.slice(0, 10)}, ${formattedDate.slice(11, 15)}`;
          let hour = Number(formattedDate.slice(16, 18));
          let minute = formattedDate.slice(18, 21);
          let period = 'PM';
          let successColor = 'green';
          const changeSuccessColor = () => {
            successColor = 'blue';
          }

          const reverseSuccessColor = () => {
            successColor = 'green';
          }

          if (hour === 0) {
            hour = 12;
            period = 'AM';
          } else if (hour < 12) {
            period = 'AM';
          } else if (hour > 12) {
            hour = hour - 12;
          }

          let formattedTime = `${String(hour)}${minute} ${period}`;

          return (
            <div key={index} className="event">
              <div className="event-header">
                <div className="text">
                  <p><strong>{event.event_type} - {shortDate}</strong></p>
                  <span>{formattedTime}</span>
                </div>
                <div className="buttons">
                  <h3>Going?</h3>
                  <i
                    className="fa fa-check yes"
                    onClick={(evt) => this.handleAttendance(evt, event.event_id)}
                    aria-hidden="true"></i>
                  <i
                    className="fa fa-times no"
                    onClick={(evt) => this.handleAttendance(evt, event.event_id)}
                    aria-hidden="true"></i>
                </div>
              </div>
              <div className="event-body">
                <p>{event.event_title} at {event.event_location}.</p>
              </div>
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
