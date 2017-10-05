import React, { Component } from 'react';
import { connect } from 'react-redux';

import EventList from './EventList';

class RehearsalPage extends Component {

  render() {
    return (
      <div className="RehearsalPage">
        <EventList data={this.props.rehearsals} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    rehearsals: state.rehearsals
  }
}

export default connect(mapStateToProps)(RehearsalPage);
