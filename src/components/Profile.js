import React, { Component } from 'react';
import { connect } from 'react-redux'

import LeftMainPageSideBar from './LeftMainPageSideBar';
import NewsFeed from './NewsFeed';
import UserProfile from './UserProfile';

class Profile extends Component {

  componentDidMount() {
    const url = this.props.apiURL;
    const username = this.props.match.params.username;
    fetch(`${url}/api/profile/${username}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.updateUser(results);
    })
  }

  componentWillUnmount() {
    this.props.clearUser();
  }

  updateUser = (user) => {
    console.log('UPDATING USER');
    this.props.updateUser(user);
    this.updateUserInstruments(user.id);
    this.updateUserTracks(user.id);
    this.updateUserVids(user.id);
  }

  updateUserInstruments = (userid) => {

    const url = this.props.apiURL;
    fetch(`${url}/api/instrumentuser/${userid}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.updateUserInstruments(results.rows);
    })

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
        <UserProfile user={this.props.currentUser} />
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
    },
    setCurrentUserTracks: (tracks) => {
      const action = { type: 'SET_CURRENT_USER_TRACKS', tracks };
      dispatch(action);
    },
    setCurrentUserVids: (videos) => {
      const action = { type: 'SET_CURRENT_USER_VIDS', videos };
      dispatch(action);
    },
    updateUserInstruments: (instruments) => {
      const action = { type: 'UPDATE_INSTRUMENTS', instruments };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
