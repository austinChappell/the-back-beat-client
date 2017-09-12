import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProfileContent from './ProfileContent';
import ProfileInfoNavBar from './ProfileInfoNavBar';

class ProfileInfo extends Component {

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
      <div className="ProfileInfo">
        <ProfileInfoNavBar />
        <ProfileContent user={this.props.currentUser} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);
