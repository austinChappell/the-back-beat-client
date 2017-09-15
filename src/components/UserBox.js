import React, { Component } from 'react';

class UserBox extends Component {

  constructor() {
    super();

    this.state = {
      users: [],
      userIndex: 1,
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

  goToNextUser = () => {
    if (this.state.userIndex === this.state.users.length - 1) {
      this.setState({ userIndex: 0 });
    } else {
      this.setState({ userIndex: this.state.userIndex + 1 });
    }
  }

  goToPrevUser = () => {
    if (this.state.userIndex === 0) {
      this.setState({ userIndex: this.state.users.length - 1 });
    } else {
      this.setState({ userIndex: this.state.userIndex - 1 });
    }
  }

  render() {
    console.log('USER INDEX', this.state.userIndex);
    console.log('USER LENGTH', this.state.users.length);
    return (
      <div className="UserBox">
        <h1>UserBox Component</h1>
        <div className="user-box-results">
          {this.state.users.map((user, index) => {
            return (
              <div
                key={index}
                className={ index === this.state.userIndex ? "single-user" : "hidden" }>
                <h2>{user.first_name} {user.last_name}</h2>
                <span><strong>Email:</strong> {user.email}</span> <br />
                <span><strong>Skill:</strong> {user.skill_level}</span>
                <hr />
                <button onClick={this.goToPrevUser}>Prev</button>
                <button onClick={this.goToNextUser}>Next</button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default UserBox;
