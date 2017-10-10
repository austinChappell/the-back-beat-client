import React, { Component } from 'react';
import { connect } from 'react-redux';

import EventList from './EventList';

class LocalEventsPage extends Component {
  render() {
    return (
      <div className="LocalEventsPage">
        <EventList
          attendanceButtons={false}
          data={this.props.allEventsInCity}
          eventType="local"
          url="event"
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allEventsInCity: state.allEventsInCity
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocalEventsPage);
