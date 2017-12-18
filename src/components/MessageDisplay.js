import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from "socket.io-client";

import MessageInput from './MessageInput';

class MessageDisplay extends Component {

  constructor(props) {
    super(props);

    this.state = {
      numOfSelectedMessages: 0
    }

    this.socket = io(props.apiURL);

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

  sendMessage = (evt) => {
    // if (evt) {
      evt.preventDefault();
    // }
    const api = this.props.apiURL;
    fetch(`${api}/message/send?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'POST',
      body: JSON.stringify({
        message: this.props.currentMessage,
        recipientId: this.props.currentRecipient.id,
        recipientFirstName: this.props.currentRecipient.first_name,
        recipientLastName: this.props.currentRecipient.last_name,
        recipientEmail: this.props.currentRecipient.email
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('RESULTS', results.rows);
      // this.filterMessages(this.props.currentRecipient);
      this.props.clearCurrentMessageText();
      this.socket.emit('SEND_INDIVIDUAL_MESSAGE');
    })
  };

  handleChange = (evt) => {
    this.props.handleChange(evt);
  }

  // filterMessages = (user) => {
  //   const filteredMessages = [];
  //   this.props.allMessages.map((message) => {
  //     if (message.sender_id === user.id || message.recipient_id === user.id) {
  //       filteredMessages.push(message);
  //     }
  //   });
  //   console.log('FILTERED MESSAGES', filteredMessages);
  //   // TODO: Add a set interval in here to refresh the current message string
  // }

  render() {

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
      <MessageInput />
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
    clearCurrentMessageText: () => {
      const action = { type: 'CLEAR_CURRENT_MESSAGE_TEXT' };
      dispatch(action);
    },

    handleChange: (evt) => {
      const action = { type: 'UPDATE_CURRENT_MESSAGE', val: evt.target.value };
      dispatch(action);
    },

    resetMessage: () => {
      const action = { type: 'RESET_CURRENT_MESSAGE' };
      dispatch(action);
    },

    setCurrentRecipientAndMessages: (user, messages) => {
      const action = { type: 'SET_CURRENT_RECIPIENT_AND_MESSAGES', user, messages };
      dispatch(action);
    },

    updateNumOfUnreadMsgs: (num) => {
      const action = { type: 'UPDATE_NUM_OF_UNREAD_MSGS', num };
      dispatch(action);
    },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDisplay);
