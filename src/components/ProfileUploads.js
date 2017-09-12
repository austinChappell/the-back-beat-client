import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileUploads extends Component {
  render() {
    return (
      <div className="ProfileUploads">
        Profile Uploads Component
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUploads);
