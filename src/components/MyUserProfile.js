import React, { Component } from 'react';
import MyProfileInfo from './MyProfileInfo';

class MyUserProfile extends Component {
  render() {
    const user = this.props.user;
    return (
      // <div className="CenterComponent UserProfile">
      //   <h2>Your Profile</h2>
      //   <div className="profile-info">
      //     <span>Logged in as <span className="username">{user.username}</span></span>
      //     <h3>{user.first_name} {user.last_name}</h3>
      //     <h4>Email: {user.email}</h4>
      //     <h4>City: {user.city}</h4>
      //     <h4>Skill Level: {user.skill_level}</h4>
      //   </div>
      // </div>
      <div className="CenterComponent UserProfile">
        This is the userprofile component
        <h2>{user.first_name} {user.last_name}</h2>
        <MyProfileInfo />
      </div>
    )
  }
}

export default MyUserProfile;
