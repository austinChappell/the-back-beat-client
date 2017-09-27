import React, { Component } from 'react';
import { connect } from 'react-redux';

class CalendarPage extends Component {
  render() {
    return (
      <div className="CalendarPage">
        Event Page
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage);
