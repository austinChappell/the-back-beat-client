import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProfileBands from './ProfileBands';
import ProfileConnections from './ProfileConnections';
import ProfileEvents from './ProfileEvents';
import ProfileInfoMain from './ProfileInfoMain';
import ProfileUploads from './ProfileUploads';

class ProfileContent extends Component {

  state = {
    userInstruments: []
  }

  componentDidMount() {
    this.getInstruments();
  }

  componentDidUpdate() {
    this.getInstruments();
  }

  getInstruments = () => {

    const url = this.props.apiURL;
    fetch(`${url}/api/instrumentuser/${this.props.user.id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ userInstruments: results.rows })
    })

  }

  render() {

    const contentType = this.props.profileContent;
    let content;

    if (contentType === 'main') {
      content = <ProfileInfoMain user={this.props.user} instruments={this.state.userInstruments} />;
    } else if (contentType === 'events') {
      content = <ProfileEvents user={this.props.user} />;
    } else if (contentType === 'connections') {
      content = <ProfileConnections user={this.props.user} />;
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
    profileContent: state.profileContent
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContent);
