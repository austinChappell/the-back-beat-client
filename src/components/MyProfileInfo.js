import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProfileContent from './ProfileContent';
import ProfileInfoNavBar from './ProfileInfoNavBar';

class MyProfileInfo extends Component {

  render() {
    return (
      <div className="ProfileInfo">
        <ProfileInfoNavBar />
        <ProfileContent user={this.props.loggedInUser} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUsername: state.currentUsername,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileInfo);
