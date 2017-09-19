import React, { Component } from 'react';

class MessageUserSideBar extends Component {
  render() {

    let users;

    if (this.props.users.length > 0) {
      users = <div className="list-results">
        {this.props.users.map((user, index) => {
          return (
            <div key={index} className="single-search-result" onClick={() => this.props.setCurrentRecipient(user)}>
              <h2>{user.first_name} {user.last_name} <span>{user.city}</span></h2>
            </div>
          )
        })}
      </div>
    } else {
      users = null;
    }

    return (
      <div className="MessageUserSideBar">
        {users}
      </div>
    )
  }
}

export default MessageUserSideBar;
