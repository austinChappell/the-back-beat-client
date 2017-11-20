import React, { Component } from 'react';
import { connect } from 'react-redux'

import LeftMainPageSideBar from './LeftMainPageSideBar';
import NewsFeed from './NewsFeed';
import MyUserProfile from './MyUserProfile';

class MyProfile extends Component {

  componentDidMount() {
    this.props.updateUser(this.props.loggedInUser);
    this.updateUserVids(this.props.loggedInUser.id);
    this.updateUserTracks(this.props.loggedInUser.id);
  }

  updateUserTracks = (userid) => {

    const url = this.props.apiURL;
    fetch(`${url}/api/user/tracks/${userid}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.setCurrentUserTracks(results.rows);
    });

  }

  updateUserVids = (userid) => {

    const url = this.props.apiURL;
    fetch(`${url}/api/user/vids/${userid}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.setCurrentUserVids(results.rows);
    });
  }

  render() {
    return (
      <div className="Profile">
        <LeftMainPageSideBar />
        <MyUserProfile user={this.props.loggedInUser} />
        <NewsFeed />
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

    setCurrentUserTracks: (tracks) => {
      const action = { type: 'SET_CURRENT_USER_TRACKS', tracks };
      dispatch(action);
    },

    setCurrentUserVids: (videos) => {
      const action = { type: 'SET_CURRENT_USER_VIDS', videos };
      dispatch(action);
    },

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
