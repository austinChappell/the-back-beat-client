import React, { Component } from 'react';
import { connect } from 'react-redux';

import MyProfileInfo from './MyProfileInfo';
import AvatarCropper from "react-avatar-cropper";

class MyUserProfile extends Component {

  state = {
    cropperOpen: false,
    img: null,
  }

  openFilePicker = () => {
    this.refs.in.click();
  }

  handleFile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    if (!file) return;

    reader.onload = (img) => {
      this.handleFileChange(img.target.result);
    };
    reader.readAsDataURL(file);
  }

  handleFileChange = (dataURI) => {
    this.setState({
      img: dataURI,
      croppedImg: this.state.croppedImg,
      cropperOpen: true
    });
  }

  handleCrop = (dataURI) => {
    this.setState({
      cropperOpen: false,
      img: null,
      croppedImg: dataURI
    }, () => {
      this.handleSubmit();
    });
  }

  handleRequestHide = () => {
    this.setState({
      cropperOpen: false
    });
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
        image: this.state.croppedImg
      })
    })
  }

  render() {

    const user = this.props.user;
    const profileImgSrc = this.state.croppedImg ? this.state.croppedImg :  `${this.props.apiURL}/files/profile_images/profile_image_${user.id}.jpg?v=1`;

    return (
      <div className="CenterComponent UserProfile">
        <h2>{user.first_name} {user.last_name}</h2>
        <div
          className="avatar-photo"
          onClick={this.openFilePicker}
          style={{
            backgroundImage: `url(${profileImgSrc})`,
            backgroundSize: 'cover'
          }}
        >
          <div className="avatar-edit">
            <span>Edit<br />Photo<br />
              <i className="fa fa-camera"></i>
            </span>
            <i className="fa fa-camera"></i>
          </div>
        </div>

        {this.state.cropperOpen &&
          <AvatarCropper
            onRequestHide={this.handleRequestHide}
            cropperOpen={this.state.cropperOpen}
            onCrop={this.handleCrop}
            image={this.state.img}
            width={400}
            height={400}
          />
        }
        <input
          ref="in"
          type="file"
          accept="image/*"
          style={{display: 'none'}}
          onChange={this.handleFile}
        />
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
