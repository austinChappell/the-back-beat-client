import React, { Component } from 'react';
import ProfileInfo from './ProfileInfo';
import io from "socket.io-client";

import { connect } from 'react-redux';

import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ReactTooltip from 'react-tooltip';
import TextField from 'material-ui/TextField';
import MessageIcon from 'material-ui-icons/Message';

import Modal from './Modal';
import TextArea from './TextArea';

class UserProfile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      displayModal: false,
      hasPerformedWith: true,
      message: '',
      modalStage: 0,
      showExitButton: true,
    }

    this.socket = io(props.apiURL);

  }

  componentDidMount() {
    this.hasPerformedWith(this.props.user.id);
  }

  addPerformer = () => {
    const apiURL = this.props.apiURL;

    fetch(`${apiURL}/api/perform/add?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'POST',
      body: JSON.stringify({recipientid: this.props.user.id})
    })
  }

  hasPerformedWith = (performerid) => {
    console.log('has performed with function starting');
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/performers/findmatch/${performerid}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('has performed with results');
      this.setState({ hasPerformedWith: results.rows.length > 0 });
    }).catch((err) => {
      console.log('error', err);
    })
  }

  sendMessage = (evt) => {
    evt.preventDefault();
    let message = this.state.message;
    let musician = this.props.user;
    const url = this.props.apiURL;
    fetch(`${url}/message/send?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'POST',
      body: JSON.stringify({
        date: new Date(),
        message,
        recipientId: musician.id,
        recipientFirstName: musician.first_name,
        recipientLastName: musician.last_name,
        recipientEmail: musician.email
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.socket.emit('SEND_INDIVIDUAL_MESSAGE', results.rows[0]);
      this.setState({ message: '', modalStage: 1, showExitButton: false }, () => {
        setTimeout(() => {
          this.setState({ displayModal: false, modalStage: 0, showExitButton: true });
        }, 2000);
      })
    }).catch((err) => {
      console.error('SEND MESSAGE ERROR', err);
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

  handleMessageChange = (message) => {
    this.setState({ message });
  }

  render() {

    let modalContent;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.exitClick}
      />,
      <FlatButton
        disabled={this.state.message === ''}
        label="Submit"
        primary={true}
        onClick={(evt) => this.sendMessage(evt)}
      />,
    ];

    switch(this.state.modalStage) {
      case 0:
        modalContent = <div>
          <TextField
            className="message-input"
            multiLine={true}
            rows={1}
            rowsMax={4}
            floatingLabelText="Your Message"
            floatingLabelStyle={{textAlign: 'left'}}
            onChange={(evt) => this.handleMessageChange(evt.target.value)}
            value={this.state.message}
          />
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
    const profileImgSrc = user.profile_image_url;

    return (
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
          <div className="action-buttons">
            <FloatingActionButton
              onClick={this.writeMessage}
              style={{ alignSelf: 'flex-start' }}
              data-tip={`Send ${user.first_name}<br />a message`}
            >
              <MessageIcon />
            </FloatingActionButton>
            <FloatingActionButton
              onClick={this.addPerformer}
              style={{ alignSelf: 'flex-start' }}
              secondary={true}
              data-tip={`Have you performed<br />with ${user.first_name}?`}
              disabled={this.state.hasPerformedWith}
            >
              <ContentAdd />
            </FloatingActionButton>
            <ReactTooltip multiline={true} delayShow={100}/>
          </div>
        </div>
        <ProfileInfo />

        <Dialog
          modal={false}
          actions={actions}
          open={this.state.displayModal}
          onRequestClose={this.exitClick}
          style={{textAlign: 'center'}}
        >

          {modalContent}

        </Dialog>

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
