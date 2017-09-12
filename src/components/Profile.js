import React, { Component } from 'react';
import { connect } from 'react-redux'

import LeftMainPageSideBar from './LeftMainPageSideBar';
import RightMainPageSideBar from './RightMainPageSideBar';
import UserProfile from './UserProfile';

class Profile extends Component {

  componentDidMount() {
    fetch(`http://localhost:6001/api/userprofile/${ this.props.currentUsername }`).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('results', results);
    })
  }

  render() {
    return (
      <div className="Profile">
        <LeftMainPageSideBar />
        <UserProfile />
        <RightMainPageSideBar />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUsername: state.currentUsername
  }
}

export default connect(mapStateToProps)(Profile);
