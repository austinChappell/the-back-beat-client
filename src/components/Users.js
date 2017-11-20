import React, { Component } from 'react';

class Users extends Component {

  state = {
    users: []
  }

  componentDidMount() {
    // const url = 'http://localhost:6001/api/users';
    fetch(`${url}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      this.setState({
        users: data
      })
    })
  }

  render() {
    return (
      <div className="Users">
        <h1>Users Component</h1>
        <div className="user-results">
          {this.state.users.map((user, index) => {
            return (
              <div key={index} className="single-user">
                <h2>{user.first_name} {user.last_name}</h2>
                <span><strong>Email:</strong> {user.email}</span> <br />
                <span><strong>Skill:</strong> {user.skill_level}</span>
                <hr />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Users;
