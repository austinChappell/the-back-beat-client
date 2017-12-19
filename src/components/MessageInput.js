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

  componentDidMount() {
    this.socket.on('NOTIFY_TYPING', (user) => {
      if (this.props.currentRecipient.id === user.id) {
        clearTimeout(this.cancelTimeout);
        this.setState({ userIsTyping: true, userTyping: `${user.firstName} ${user.lastName}` }, () => {
          this.cancelTimeout = setTimeout(() => {
            this.setState({ userIsTyping: false, userTyping: null });
          }, 2000);
        })
      }
    })
  }

  clearCurrentMessageText = () => {
    this.setState({ inputValue: '' });
  }

  handleChange = (evt) => {
    this.setState({ inputValue: evt.target.value })
    this.socket.emit('MESSAGE_TYPING', { firstName: this.props.loggedInUser.first_name, lastName: this.props.loggedInUser.last_name, id: this.props.loggedInUser.id })
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

    const userTyping = this.state.userIsTyping ? <span>{this.state.userTyping} is typing</span> : null;

    return (
      <div className="MessageInput">
        <input
          className="message-bar"
          onChange={(evt) => this.handleChange(evt)}
          onKeyUp={(evt) => this.handleKeyUp(evt)}
          value={this.state.inputValue}
        />
        <br />
        {userTyping}
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
