import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from "socket.io-client";

import MessageInput from './MessageInput';

class MessageDisplay extends Component {

  constructor(props) {
    super(props);

    this.state = {
      numOfSelectedMessages: 0,
      userIsTyping: false,
      userTyping: null
    }

    this.socket = io(props.apiURL);

  }

  componentWillMount() {
    this.props.clearSelectedMessages();
  }

  componentDidUpdate() {
    // this.refs.messageBox.scrollTop = 200;
    let selectedMessages = this.props.selectedMessages ? this.props.selectedMessages : [];
    if (this.props.currentRecipient && selectedMessages.length !== this.state.numOfSelectedMessages) {
      this.setState({
        numOfSelectedMessages: this.props.selectedMessages.length
      }, () => {
        this.refs.messageBox.scrollTop = this.refs.messageBox.scrollHeight;
      })
    }
    this.getUnreadMessages();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  getUnreadMessages = () => {
    const url = this.props.apiURL;

    fetch(`${url}/messages/unread?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.updateNumOfUnreadMsgs(results.rows.length);
      // this.setState({ numOfUnreadMessages: results.rows.length });
    })

  }

  sendMessage = (message) => {

    const api = this.props.apiURL;
    const recipientId = this.props.currentRecipient.id;

    fetch(`${api}/message/send?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'POST',
      body: JSON.stringify({
        date: new Date(),
        message,
        recipientId,
        recipientFirstName: this.props.currentRecipient.first_name,
        recipientLastName: this.props.currentRecipient.last_name,
        recipientEmail: this.props.currentRecipient.email
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      // this.filterMessages(this.props.currentRecipient);
      this.socket.emit('SEND_INDIVIDUAL_MESSAGE', results.rows[0]);
    })
  };

  render() {

    console.log('MESSAGE DISPLAY PROPS', this.props);

    const loggedInUserId = this.props.loggedInUser.id;
    // console.log('MY ID', loggedInUserId);
    const recipient = this.props.currentRecipient ? <h2>{this.props.currentRecipient.first_name} {this.props.currentRecipient.last_name}</h2> : null;
    let messageDisplay;
    let selectedMessages = this.props.selectedMessages ? this.props.selectedMessages : [];

    messageDisplay = <div className="message-box">
      <div className={this.props.currentRecipient ? 'currentRecipient' : ''}>
        {recipient}
      </div>
      <div className="messages" ref="messageBox">
        {selectedMessages.map((message, index) => {
          return (
            <div key={index} className={message.sender_id === loggedInUserId ? "message sent" : "message received"}>
              <div className={message.sender_id === loggedInUserId ? "message-wrapper sent" : "message-wrapper received"}>
                <p>{message.message_text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput
        parentName="MessageDisplay"
        sendMessage={this.sendMessage}
      />
    </div>

    return (
      <div className="MessageDisplay">
        {messageDisplay}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allMessages: state.allMessages,
    apiURL: state.apiURL,
    currentMessage: state.currentMessage,
    currentRecipient: state.currentRecipient,
    selectedMessages: state.selectedMessages,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    clearSelectedMessages: () => {
      const action = { type: 'CLEAR_SELECTED_MESSAGES' };
      dispatch(action);
    },

    updateNumOfUnreadMsgs: (num) => {
      const action = { type: 'UPDATE_NUM_OF_UNREAD_MSGS', num };
      dispatch(action);
    },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDisplay);
