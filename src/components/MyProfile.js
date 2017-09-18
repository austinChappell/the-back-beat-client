import React, { Component } from 'react';
import { connect } from 'react-redux'

import LeftMainPageSideBar from './LeftMainPageSideBar';
import RightMainPageSideBar from './RightMainPageSideBar';
import MyUserProfile from './MyUserProfile';

class MyProfile extends Component {

  render() {
    return (
      <div className="Profile">
        <LeftMainPageSideBar />
        <MyUserProfile user={this.props.loggedInUser} />
        <RightMainPageSideBar />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    currentUsername: state.currentUsername,
    currentUser: state.currentUser,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (results) => {
      const action = { type: 'UPDATE_USER', user: results };
      dispatch(action);
    },
    clearUser: () => {
      const action = { type: 'UPDATE_USER', user: {} };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
