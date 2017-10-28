import React, { Component } from 'react';
import { connect } from 'react-redux';

import MyProfileInfo from './MyProfileInfo';
import AvatarCropper from "react-avatar-cropper";

class MyUserProfile extends Component {

  state = {
    cropperOpen: false,
    img: null,
    profilePicture: this.props.loggedInUser.has_profile_photo
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
        id: this.props.loggedInUser.id,
        image: this.state.croppedImg
      })
    }).then(() => {
      this.setState({ profilePicture: true });
    }).catch((err) => {
      console.log(err);
    })
  }

  deletePhoto = () => {
    console.log('DELETE PHOTO FUNCTION RUNNING');
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/uploaddefault`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }).then(() => {
      this.setState({ profilePicture: false, croppedImg: null });
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {

    const randomCache = Math.floor(Math.random() * 1000000);

    const user = this.props.user;
    const profileImgSrc = `${this.props.apiURL}/files/profile_images/profile_image_${user.id}.jpg?v=${randomCache}`;

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
        <button onClick={this.deletePhoto}>Delete Photo</button>

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
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser
  }
}

export default connect(mapStateToProps)(MyUserProfile);
