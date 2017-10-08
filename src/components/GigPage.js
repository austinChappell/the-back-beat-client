import React, { Component } from 'react';
import { connect } from 'react-redux';

import EventList from './EventList';

class GigPage extends Component {

  render() {
    return (
      <div className="GigPage">
        <EventList
          data={this.props.gigs}
          url="band_event"
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gigs: state.gigs
  }
}

export default connect(mapStateToProps)(GigPage);
