import React, { Component } from 'react';
import { connect } from 'react-redux'

import LeftMainPageSideBar from './LeftMainPageSideBar';
import RightMainPageSideBar from './RightMainPageSideBar';
import UserProfile from './UserProfile';

class Profile extends Component {

  componentDidMount() {
    const url = 'http://localhost:6001/api/profile';
    console.log('URL', url);
    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((response) => {
      console.log('RESPONSE', response);
      return response.json();
    }).then((results) => {
      console.log('FETCH RESULTS', results);
      this.props.updateUser(results);
    })
  }

  render() {
    return (
      <div className="Profile">
        <LeftMainPageSideBar />
        <UserProfile user={this.props.currentUser} />
        <RightMainPageSideBar />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUsername: state.currentUsername,
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (results) => {
      const action = { type: 'UPDATE_USER', user: results };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
