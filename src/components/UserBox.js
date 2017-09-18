import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
      });
    });
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
        <h2>Browse Musicians</h2>
        <div className="user-box-results">
          {this.state.users.map((user, index) => {
            return (
              <div
                key={index}
                className={ index === this.state.userIndex ? "single-user" : "hidden" }>
                <h3><Link onClick={() => this.props.updateUser(user)} to={`/profile/${user.username}`}>{user.first_name} {user.last_name}</Link></h3>
                <span><strong>City:</strong> {user.city}</span> <br />
                <span><strong>Skill:</strong> {user.skill_level}</span>
                <div className="buttons">
                  <button onClick={this.goToPrevUser}>Prev</button>
                  <button onClick={this.goToNextUser}>Next</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => {
      const action = { type: 'UPDATE_USER', user };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserBox);
