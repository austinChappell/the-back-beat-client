import React, { Component } from 'react';
import { connect } from 'react-redux';

import BandEventBox from './BandEventBox';
import BrowseBox from './BrowseBox';

class LeftMainPageSideBar extends Component {

  state = {
    eventIndex: 0,
    eventIndexRange: [0, 1],
    eventOffset: 0
  }

  componentDidMount() {
    this.getMyEvents('Gig');
    this.getMyEvents('Rehearsal');
    setTimeout(() => {
      this.loadEvents();
    }, 1000);
  }

  getMyEvents = (type) => {
    const url = this.props.apiURL;
    const limit = 'nolimit';
    fetch(`${url}/api/my_band_events/${type}/${limit}`, {
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

  handleAttendance = (evt, eventId, attending) => {
    const url = this.props.apiURL;
    evt.target.classList.add('selected');
    if (attending) {
      evt.target.nextElementSibling.style.display = 'none';
    } else {
      evt.target.previousElementSibling.style.display = 'none';
    }
    fetch(`${url}/api/event/attendance`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        eventId,
        attending
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log(results);
    })
  }

  swipe = (itemsArray, itemIndexName, itemOffset, direction) => {

    console.log('button clicked', itemsArray, itemIndexName, itemOffset, direction);

    const updateObj = {};
    updateObj[itemOffset] = this.state[itemOffset] + (direction * -100);
    if (this.state[itemIndexName] === this.props[itemsArray].length - 1 && direction === 1) {
      updateObj[itemIndexName] = 0;
    } else if (this.state[itemIndexName] === 0 && direction === -1) {
      updateObj[itemIndexName] = this.props[itemsArray].length - 1;
    } else {
      updateObj[itemIndexName] = this.state[itemIndexName] + direction;
    }
    this.setState(updateObj);
  }

  render() {
    return (
      <div className="LeftMainPageSideBar">
        <BrowseBox
          currentIndex={this.state.eventIndex}
          goToPrev={() => this.swipe('allEventsInCity', 'eventIndex', 'eventOffset', -1)}
          goToNext={() => this.swipe('allEventsInCity', 'eventIndex', 'eventOffset', 1)}
          minIndex={0}
          maxIndex={this.props.allEventsInCity.length - 1}
          index={this.state.eventIndex}
          title="Events"
        >

          <div className="browse-box-container">

            {this.props.allEventsInCity.map((event, index) => {

              const startingPosition = (index) * 100;
              const leftString = String(startingPosition + this.state.eventOffset) + '%';

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
                <div key={index} className="show-item" style={{left: leftString}}>

                  <h3>
                    {event.event_title}
                  </h3>
                  <span>{shortDate} - {formattedTime}</span> <br />
                  <span><strong>City:</strong> {event.event_city}</span> <br />
                  <span><strong>Venue:</strong> {event.event_location}</span>

                  <div className="buttons">
                    <h3>Going?</h3>
                    <i
                      className="fa fa-check yes"
                      onClick={(evt) => this.handleAttendance(evt, event.event_id, true)}
                      aria-hidden="true"></i>
                    <i
                      className="fa fa-times no"
                      onClick={(evt) => this.handleAttendance(evt, event.event_id, false)}
                      aria-hidden="true"></i>
                  </div>

                </div>
              )
            })}

        </div>

        </BrowseBox>

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
