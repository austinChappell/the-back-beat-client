import React, { Component } from 'react';
import { connect } from 'react-redux';

import MyProfileInfo from './MyProfileInfo';
import AvatarCropper from 'react-avatar-cropper';
import EditProfile from './EditProfile'

class MyUserProfile extends Component {

  state = {
    cropperOpen: false,
    editProfile: false,
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

  setUser = () => {
    console.log('SET USER FUNCTION RUNNING');
    const url = this.props.apiURL;
    fetch(`${url}/myprofile`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      console.log('FETCH HAPPENED');
      return response.json();
    }).then((results) => {
      const loggedInUser = results.rows[0];
      this.props.addLoggedInUser(loggedInUser);
    }).then(() => {
      this.toggleDialog();
    })
  }

  toggleDialog = () => {
    console.log('edit profile function');
    this.setState({ editProfile: !this.state.editProfile });
  }

  updateProfile = (evt, userInfo) => {
    console.log('USER INFO INSIDE UPDATE PROFILE FUNCTION', userInfo);
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/myprofile/update`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({userInfo})
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setUser();
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {

    const editProfileComponent = this.state.editProfile ? <EditProfile showDialog={this.state.editProfile} /> : null;

    const randomCache = Math.floor(Math.random() * 1000000);

    const user = this.props.user;
    const profileImgSrc = `${this.props.apiURL}/files/profile_images/profile_image_${user.id}.jpg?v=${randomCache}`;

    return (
      <div className="CenterComponent UserProfile">
        <EditProfile
          showDialog={this.state.editProfile}
          toggleDialog={this.toggleDialog}
          updateProfile={this.updateProfile}
        />
        <h2>{user.first_name} {user.last_name}
          <i
            className="fa fa-pencil-square-o"
            aria-hidden="true"
            onClick={this.toggleDialog}
            style={{marginLeft: '10px'}}
          >
          </i>
        </h2>
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
        <button className="delete-photo-button" onClick={this.deletePhoto}>Delete Photo</button>

        {this.state.cropperOpen &&
          <div>
            <AvatarCropper
              onRequestHide={this.handleRequestHide}
              cropperOpen={this.state.cropperOpen}
              onCrop={this.handleCrop}
              image={this.state.img}
              width={400}
              height={400}
            />
            <div className="crop-circle"></div>
          </div>
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

const mapDispatchToProps = (dispatch) => {
  return {
    addLoggedInUser: (user) => {
      const action = { type: 'ADD_LOGGED_IN_USER', user };
      dispatch(action);
    },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyUserProfile);
