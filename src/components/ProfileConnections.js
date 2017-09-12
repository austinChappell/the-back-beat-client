import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileConnections extends Component {
  render() {
    return (
      <div className="ProfileConnections">
        Profile Connections Component
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileConnections);
