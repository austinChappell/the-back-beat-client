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

    return (

      // TODO: FINISH FILLING IN INFO. WILL NEED TO FORMAT DATE AND TIME

      <div className="BandEventPage">
        <h1>{eventData.event_type} with {eventData.band_name}</h1>
        <h2>{eventData.event_title}</h2>
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
