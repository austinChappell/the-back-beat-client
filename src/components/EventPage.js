import React, { Component } from 'react';
import { connect } from 'react-redux';

class EventPage extends Component {

  state = {
    eventData: {}
  }

  componentDidMount() {
    this.getBandEventData();
  }

  getBandEventData = () => {
    const eventType = this.props.match.params.eventtype;
    const url = this.props.apiURL;
    const eventId = this.props.match.params.eventId;
    console.log('EVENT TYPE', eventType);
    console.log('EVENT ID', eventId);
    fetch(`${url}/api/${eventType}/${eventId}/details`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ eventData: results.rows[0] }, () => {
        console.log('STATE', this.state);
      });
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

  render() {
    console.log('PROPS', this.props.match.params);

    const eventData = this.state.eventData;
    const eventType = this.props.match.params.eventtype;

    let buttons = null;

    if (eventType === 'event') {
      buttons = <div className="buttons">
        <h3>Going?</h3>
        <i
          className="fa fa-check yes"
          onClick={(evt) => this.handleAttendance(evt, eventData.event_id, true)}
          aria-hidden="true"></i>
          <i
            className="fa fa-times no"
            onClick={(evt) => this.handleAttendance(evt, eventData.event_id, false)}
            aria-hidden="true"></i>
          </div>
        }

    let mainTitle = eventType === 'band_event' ?
    <p><strong>Band:</strong> {eventData.band_name}</p>
    :
    <h2>{eventData.event_title}</h2>;

    let date = eventData.event_date_time;
    let formattedDate = String(new Date(date));
    let shortDate = `${formattedDate.slice(0, 10)}, ${formattedDate.slice(11, 15)}`;
    let hour = Number(formattedDate.slice(16, 18));
    let minute = formattedDate.slice(18, 21);
    let period = 'PM';
    let successColor = 'green';

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

      // TODO: FINISH FILLING IN INFO. WILL NEED TO FORMAT DATE AND TIME

      <div className="EventPage">
        <h1>{eventData.event_type} Info</h1>
        {mainTitle}
        <p><strong>Date:</strong> {shortDate}</p>
        <p><strong>Time:</strong> {formattedTime}</p>
        <p><strong>Where:</strong> {eventData.event_location}</p>
        {buttons}
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

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
