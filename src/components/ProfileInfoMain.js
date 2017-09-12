import React, { Component } from 'react';

class ProfileInfoMain extends Component {
  render() {
    const user = this.props.user;
    return (
      <div className="ProfileInfoMain">
        <div className="profile-info">
          <h3>{user.first_name} {user.last_name}</h3>
          <h4>Email: {user.email}</h4>
          <h4>City: {user.city}</h4>
          <h4>Skill Level: {user.skill_level}</h4>
        </div>
      </div>
    )
  }
}

export default ProfileInfoMain;
