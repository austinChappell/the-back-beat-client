import React, { Component } from 'react';
import { connect } from 'react-redux';

import MyProfileInfo from './MyProfileInfo';
import RaisedButton from 'material-ui/RaisedButton';

import Upload from 'material-ui-upload/Upload';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ReactCrop from 'react-image-crop';

import 'react-image-crop/lib/ReactCrop.scss';

class MyUserProfile extends Component {

  state = {
    pictures: { 'initialKey': null }
  }

  handleSubmit = () => {
    const url = `${this.props.apiURL}/upload`;
    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        pictures: this.state.pictures
      })
    })
  }

  onChange = (pictures) => this.setState({pictures});

  onFileLoad = (e, file) => console.log(e.target.result, file.name);

  render() {

    let imageData = Object.values(this.state.pictures)[0];

    const cropper = this.state.pictures ? <ReactCrop src={imageData} /> : null;

    console.log('STATE', this.state);

    const options = {
      baseUrl: 'http://127.0.0.1',
      query: {
        warrior: 'fight'
      }
    }

    const user = this.props.user;
    return (
      // <div className="CenterComponent UserProfile">
      //   <h2>Your Profile</h2>
      //   <div className="profile-info">
      //     <span>Logged in as <span className="username">{user.username}</span></span>
      //     <h3>{user.first_name} {user.last_name}</h3>
      //     <h4>Email: {user.email}</h4>
      //     <h4>City: {user.city}</h4>
      //     <h4>Skill Level: {user.skill_level}</h4>
      //   </div>
      // </div>
      <div className="CenterComponent UserProfile">
        <h2>{user.first_name} {user.last_name}</h2>
        {/* <form onSubmit={this.handleSubmit}>
          <input type="file" name="file" />
          <input type="submit" value="Submit" />
        </form> */}
        {/* <Upload label="Add" onFileLoad={this.onFileLoad}/> */}
        <UploadPreview
          title="Picture"
          label="Add"
          initialItems={this.state.pictures}
          onChange={this.onChange}
        />
        <RaisedButton
          label="Save"
          onClick={this.handleSubmit}
        />
        {cropper}
        <MyProfileInfo />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

export default connect(mapStateToProps)(MyUserProfile);
