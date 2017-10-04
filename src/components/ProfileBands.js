import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileBands extends Component {

  // TODO: START BACK HERE. CURRENT USER EVENTS WILL RPOBABLY NEED TO BE STORED IN REDUX. THIS IS ALSO RELATED TO THE BUG WHEN NOT CHANGING BACK TO LOGGED IN USER INFO

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
