import React, { Component } from 'react';
import { connect } from 'react-redux'

import LeftMainPageSideBar from './LeftMainPageSideBar';
import NewsFeed from './NewsFeed';
import UserProfile from './UserProfile';

class Profile extends Component {

  componentDidMount() {
    // const url = 'http://localhost:6001/api/profile';
    const url = this.props.apiURL;
    const username = this.props.match.params.username;
    fetch(`${url}/api/profile/${username}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.updateUser(results);
    })
  }

  componentWillUnmount() {
    this.props.clearUser();
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
