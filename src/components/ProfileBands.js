import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileBands extends Component {
  render() {
    return (
      <div className="ProfileBands">
        Profile Bands Component
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBands);
