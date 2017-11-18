import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProfileBands from './ProfileBands';
import ProfileConnections from './ProfileConnections';
import ProfileEvents from './ProfileEvents';
import ProfileInfoMain from './ProfileInfoMain';
import ProfileUploads from './ProfileUploads';

class ProfileContent extends Component {

  state = {
    loggedinPerformers: [],
    sharedPerformers: [],
    userInstruments: [],
    userPerformers: []
  }

  componentDidMount() {
    this.updateUserInstruments(this.props.user.id);
    this.getPerformers(this.props.loggedInUser.id, 'loggedinPerformers');
    this.getPerformers(this.props.user.id, 'userPerformers');
  }

  filterPerformerIds = (arr) => {
    const output = [];
    arr.forEach((item) => {
      const id = Object.values(item)[0];
      output.push(id);
    })
    return output;
  }

  getPerformers = (userid, performerArray) => {
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/performers/mutual/${userid}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      // console.log(results.results.rows);
      // console.log(results.newResults.rows);
      const totalPerformers = results.results.rows.concat(results.newResults.rows);
      const filteredPerformers = this.filterPerformerIds(totalPerformers);
      const updateState = {};
      updateState[performerArray] = filteredPerformers;
      this.setState(updateState, () => {
        this.getSharedPerformers(this.state.loggedinPerformers, this.state.userPerformers);
      });
    })
  }

  getSharedPerformers = (arr1, arr2) => {
    const output = [];
    arr1.forEach((item) => {
      if (arr2.indexOf(item) !== -1) {
        output.push(item);
      }
    });
    console.log(arr1, arr2, output);
    this.setState({ sharedPerformers: output })
  }


  updateUserInstruments = (userid) => {

    const url = this.props.apiURL;
    fetch(`${url}/api/instrumentuser/${userid}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.updateUserInstruments(results.rows);
    })

  }

  render() {

    console.log('STATE', this.state);
    const contentType = this.props.profileContent;
    let content;

    if (contentType === 'main') {
      content = <ProfileInfoMain user={this.props.user} instruments={this.props.currentUserInstruments} />;
    } else if (contentType === 'events') {
      content = <ProfileEvents user={this.props.user} />;
    } else if (contentType === 'connections') {
      content = <ProfileConnections user={this.props.user} userPerformers={this.state.userPerformers} sharedPerformers={this.state.sharedPerformers} />;
    } else if (contentType === 'bands') {
      content = <ProfileBands user={this.props.user} />;
    } else {
      content = <ProfileUploads user={this.props.user} />;
    };

    // console.log('CONTENT', content, this.props.profileContent);

    return (
      <div className="ProfileContent">
        { content }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    currentUserInstruments: state.currentUserInstruments,
    loggedInUser: state.loggedInUser,
    profileContent: state.profileContent
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    updateUserInstruments: (instruments) => {
      const action = { type: 'UPDATE_INSTRUMENTS', instruments };
      dispatch(action);
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContent);
