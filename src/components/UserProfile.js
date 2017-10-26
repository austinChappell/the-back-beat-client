import React, { Component } from 'react';
import ProfileInfo from './ProfileInfo';

import { connect } from 'react-redux';

import Modal from './Modal';
import TextArea from './TextArea';

class UserProfile extends Component {

  state = {
    displayModal: false,
    message: '',
    modalStage: 0,
    showExitButton: true,
  }

  sendMessage = (evt) => {
    evt.preventDefault();
    let message = this.state.message;
    let musician = this.props.user;
    const url = this.props.apiURL;
    fetch(`${url}/message/send`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        message,
        recipientId: musician.id,
        recipientFirstName: musician.first_name,
        recipientLastName: musician.last_name,
        recipientEmail: musician.email
      })
    }).then(() => {
      this.setState({ message: '', modalStage: 1, showExitButton: false }, () => {
        setTimeout(() => {
          this.setState({ displayModal: false, modalStage: 0, showExitButton: true });
        }, 2000);
      });
    })
  }

  writeMessage = () => {
    this.setState({ displayModal: true });
  }

  exitClick = () => {
    this.setState({ displayModal: false, message: '' });
  }

  handleTextAreaChange = (evt, message) => {
    const value = evt.target.value;
    const updateObj = {};
    updateObj[message] = evt.target.value;
    this.setState(updateObj);
  }

  render() {

    let modalContent;

    switch(this.state.modalStage) {
      case 0:
        modalContent = <div>
          <TextArea
            name="message"
            placeholder="Send a message..."
            onChange={this.handleTextAreaChange}
            rows="10"
            value={this.state.message}
          />
          <button onClick={(evt) => this.sendMessage(evt)}>Send Message</button>
        </div>
        break;
      case 1:
        modalContent = <div className="message-confirm-modal">
          <h1>Message Sent!</h1>
          <i className="fa fa-check message-sent-check" aria-hidden="true"></i>
        </div>
        break;
      default:
        modalContent = null;
    }

    const user = this.props.user;
    const profileImgSrc = user.has_profile_photo ?
    `${this.props.apiURL}/files/profile_images/profile_image_${user.id}.jpg`
    :
    `${this.props.apiURL}/files/profile_images/profile_image_placeholder.png`;

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
        <div className="profile-header">
          <h2>{user.first_name} {user.last_name}</h2>
          <div
            className="avatar-photo"
            style={{
              backgroundImage: `url(${profileImgSrc})`,
              backgroundSize: 'cover'
            }}
          >
          </div>
          <div className="message-link">
            <i
              className="fa fa-commenting-o message-icon"
              onClick={this.writeMessage}
              aria-hidden="true"></i>
          </div>
        </div>
        <ProfileInfo />

        <Modal displayModal={this.state.displayModal} exitClick={this.exitClick} showExitButton={this.state.showExitButton}>

          {modalContent}

        </Modal>


      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

export default connect(mapStateToProps)(UserProfile);
