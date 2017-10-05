import React, { Component } from 'react';
import { connect } from 'react-redux';

class BandEventPage extends Component {

  state = {
    eventData: {}
  }

  componentDidMount() {
    this.getBandEventData();
  }

  getBandEventData = () => {
    const url = this.props.apiURL;
    const eventId = this.props.match.params.eventId;
    fetch(`${url}/api/band_event/${eventId}`, {
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

  render() {

    const eventData = this.state.eventData;

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

      <div className="BandEventPage">
        <h1>{eventData.event_type} Info</h1> <h2>Band: {eventData.band_name}</h2>
        <h2>When: {shortDate} - {formattedTime}</h2>
        <h2>Where: {eventData.event_location}</h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(BandEventPage);
