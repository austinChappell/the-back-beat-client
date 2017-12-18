import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from "socket.io-client";

class MessageInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      inputValue: ''
    }

    this.socket = io(this.props.apiURL);

  }

  clearCurrentMessageText = () => {
    this.setState({ inputValue: '' });
  }

  handleChange = (evt) => {
    this.setState({ inputValue: evt.target.value })
  }

  handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      this.sendMessage();
    }
  }

  sendMessage = () => {

    const apiURL = this.props.apiURL;
    const recipientId = this.props.currentRecipient.id;

    fetch(`${apiURL}/message/send?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'POST',
      body: JSON.stringify({
        date: new Date(),
        message: this.state.inputValue,
        recipientId,
        recipientFirstName: this.props.currentRecipient.first_name,
        recipientLastName: this.props.currentRecipient.last_name,
        recipientEmail: this.props.currentRecipient.email
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      // this.filterMessages(this.props.currentRecipient);
      this.clearCurrentMessageText();
      this.socket.emit('SEND_INDIVIDUAL_MESSAGE', results.rows[0]);
    })
  }

  render() {

    return (
      <div className="MessageInput">
        <input
          className="message-bar"
          onChange={(evt) => this.handleChange(evt)}
          onKeyUp={(evt) => this.handleKeyUp(evt)}
          value={this.state.inputValue}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    currentRecipient: state.currentRecipient,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput);
