import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileConnections extends Component {

  state = {
    performers: []
  }

  componentDidMount() {
    const userPerformers = this.props.userPerformers;
    const sharedPerformers = this.props.sharedPerformers;
    const loggedInUserId = this.props.loggedInUser.id;
    console.log('logged in user id', loggedInUserId);
    if (userPerformers.indexOf(loggedInUserId) == -1) {
      console.log('passing in shared performers');
      this.getPerformerInfo(sharedPerformers);
    } else {
      console.log('passing in user performers');
      this.getPerformerInfo(userPerformers);
    }
  }

  getPerformerInfo = (performers) => {
    console.log('getting performers', performers);
    const output = [];
    performers.forEach((performer) => {
      if (performer !== this.props.loggedInUser.id) {
        const apiURL = this.props.apiURL;
        fetch(`${apiURL}/api/user/${performer}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((user) => {
          output.push(user);
          this.setState({ performers: output });
        }).catch((err) => {
          console.log('error', err);
        })
      }
    })
  }

  render() {
    console.log('STATE', this.state);
    console.log(this.props.sharedPerformers);
    console.log(this.props.userPerformers);
    return (
      <div className="ProfileConnections">
        Profile Connections Component
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileConnections);
