import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class EventList extends Component {

  handleAttendance = (evt, eventId, attending) => {
    const url = this.props.apiURL;
    evt.target.classList.add('selected');
    if (attending) {
      evt.target.nextElementSibling.style.display = 'none';
    } else {
      evt.target.previousElementSibling.style.display = 'none';
    }
    fetch(`${url}/api/event/attendance?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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

  render() {

    this.props.data.sort((a, b) => {
      return a.event_date_time > b.event_date_time;
    })


    return (
      <div className="EventList">
        {this.props.data.map((event, index) => {

          let date = event.event_date_time;
          let formattedDate = String(new Date(date));
          let month = `${formattedDate.slice(4, 7)}`;
          let dateNum = `${formattedDate.slice(8, 10)}`;
          let hour = Number(formattedDate.slice(16, 18));
          let minute = formattedDate.slice(18, 21);
          let period = 'PM';

          if (hour === 0) {
            hour = 12;
            period = 'AM';
          } else if (hour < 12) {
            period = 'AM';
          } else if (hour > 12) {
            hour = hour - 12;
          }

          let formattedTime = `${String(hour)}${minute} ${period}`;

          let buttons = null;

          if (this.props.eventType === 'local' && this.props.attendanceButtons) {
            buttons = <div className="buttons">
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
          }

          return (
            <Link to={`/event/${this.props.url}/${event.event_id}`} key={index} className="event">
              <div className="dateInfo">
                <div className="date">{dateNum}</div>
                <div className="month">{month}</div>
              </div>
              <div className="info">
                <div className="top">
                  <h4 className="type">
                    {event.event_type} - {formattedTime}
                  </h4>
                  <h4 className="title">
                    {event.event_title}
                  </h4>
                </div>
                <p className="details">
                  {event.event_details}
                </p>
                {buttons}
              </div>
            </Link>
          )
        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
