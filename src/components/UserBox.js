import React, { Component } from 'react';

class UserBox extends Component {

  constructor() {
    super();

    this.state = {
      users: [],
      userIndex: 0,
    }
  }


  componentDidMount() {
    const url = 'http://localhost:6001/api/users';
    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log('DATA', data);
      this.setState({
        users: data
      // },
    // this.startCounter());
    })
  // }

  // const startCounter = () => {
  //   setInterval(() => {
  //     this.setState({
  //       userIndex: this.state.userIndex + 1
      });
  //     console.log('User Index', this.state.userIndex);
  //   }, 3000)
  }

  render() {
    return (
      <div className="UserBox">
        <h1>UserBox Component</h1>
        <div className="user-box-results">
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

export default UserBox;
