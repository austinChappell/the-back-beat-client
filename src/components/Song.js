import React, { Component } from 'react';
import { connect } from 'react-redux';

class Song extends Component {

  render() {
    return (
      <div className="Song">
        Song Component
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

export default connect(mapStateToProps)(Song);
