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
    // this.refs.chatWindow.scrollTop = 200;
    let selectedMessages = this.props.selectedMessages ? this.props.selectedMessages : [];
    if (this.props.currentRecipient && selectedMessages.length !== this.state.numOfSelectedMessages) {
      this.setState({
        numOfSelectedMessages: this.props.selectedMessages.length
      }, () => {
        this.refs.chatWindow.scrollTop = this.refs.chatWindow.scrollHeight;
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

    const now = new Date();
    const today = now.toDateString();

    const loggedInUserId = this.props.loggedInUser.id;
    // console.log('MY ID', loggedInUserId);
    const recipient = this.props.currentRecipient ? <h2>{this.props.currentRecipient.first_name} {this.props.currentRecipient.last_name}</h2> : null;
    let messageDisplay;
    let selectedMessages = this.props.selectedMessages ? this.props.selectedMessages : [];

    messageDisplay = <div className="BandChat">
      <section className="chat-section">
        <div className={this.props.currentRecipient ? 'currentRecipient' : ''}>
          {recipient}
        </div>
        <div className="chat-window" ref="chatWindow">
          {selectedMessages.map((message, index) => {
            const date = new Date(message.created_at);
            if (date.toDateString() === today) {
              message.date = 'Today';
            } else {
              message.date = date.toDateString();
            }
            message.time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let dateClass = 'date';
            for (let i = 0; i < index; i++) {
              if (selectedMessages[i].date === message.date) {
                dateClass = 'hide';
              }
            }
            return (
              <div key={index} className="message">
                <div className={dateClass}>
                  <hr />
                  <span>{message.date}</span>
                  <hr />
                </div>
                <div className="time">
                  <div className="user">
                    <img src={message.profile_image_url} /><span>{message.first_name} {message.last_name}</span>
                  </div>
                  <div className="time-stamp">
                    <span>{message.time}</span>
                  </div>
                </div>
                <p>{message.message_text}</p>
              </div>
            );
          })}
        </div>
        <MessageInput
          parentName="MessageDisplay"
          sendMessage={this.sendMessage}
        />
      </section>
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
