import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from "socket.io-client";

import Avatar from 'material-ui/Avatar';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class MessageHistorySideBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fetchHistory: true,
      messageHistory: []
    }

    this.socket = io(props.apiURL);

    this.socket.on('RECEIVE_INDIVIDUAL_MESSAGE', () => {
      this.getMessageHistory();
      setTimeout(() => {
        this.getUnreadMessages();
      })
    })

    this.socket.on('RECEIVE_UNREAD_MESSAGE', () => {
      this.getUnreadMessages();
      this.getMessageHistory();
    })

  }

  componentDidMount() {
    // this.setState({fetchHistory: true});
    this.getMessageHistory();
    this.getUnreadMessages();
  }

  componentWillUnmount() {
    clearInterval(this.stopFetch);
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

  setRecipient = (id) => {
    const url = this.props.apiURL;
    fetch(`${url}/api/user/${id}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.setCurrentRecipient(results);
      this.getUnreadMessages();
      this.getMessageHistory();
      this.props.fetchAllMessages();
    })
  }

  // TODO: FIND A WAY TO INITIALIZE THE FILTER MESSAGES FUNCTION IN MESSAGEPAGE COMPONENT WHILE PASSING IN THE USER AT THE TOP OF THE MESSAGE HISTORY LIST

  getMessageHistory = () => {

    // this.stopFetch = setInterval(() => {

      const output = [];
      const messages = this.props.allMessages;
      const loggedInUser = this.props.loggedInUser;
      console.log('MESSAGE HISTORY SIDEBAR', messages, loggedInUser);
      for (let i = messages.length - 1; i >= 0; i--) {
        let found = false;
        output.forEach((item) => {
          if ( (item.sender_id === messages[i].sender_id && messages[i].sender_id !== loggedInUser.id) || (item.sender_id === messages[i].recipient_id && messages[i].recipient_id !== loggedInUser.id) || (item.recipient_id === messages[i].sender_id && messages[i].sender_id !== loggedInUser.id) || (item.recipient_id === messages[i].recipient_id && messages[i].recipient_id !== loggedInUser.id) ) {
            found = true;
          }
        })
        if (!found) {
          output.push(messages[i]);
        }
      }
      this.props.setMessageHistory(output);
    // }, 1000)
  }

  render() {

    const randomCache = Math.floor(Math.random() * 1000000);
    let messageHistoryDisplay = null;

    if (this.props.messageHistory.length > 0) {
      messageHistoryDisplay = <div>
        {this.props.messageHistory.map((message, index) => {
          // console.log('MESSAGE', message);
          let recipientId;
          let displayName;
          let msgPreview;
          let className;
          let imageSrc;
          let unreadNotification = null;

          if (message.sender_id === this.props.loggedInUser.id) {
            displayName = message.recipient_name;
            recipientId = message.recipient_id;
          } else {
            displayName = message.sender_name;
            recipientId = message.sender_id;
          }
          if (message.message_text.length > 20) {
            msgPreview = message.message_text.slice(0, 20) + '...';
          } else {
            msgPreview = message.message_text;
          }

          unreadNotification = !message.read && message.recipient_id === this.props.loggedInUser.id ? true : false;

          let unreadSymbol = unreadNotification ? <i className="fa fa-circle" aria-hidden="true" style={{ color: 'red' }}></i> : null;

          return (
            <ListItem
              className="message-history-result"
              key={index}
              onClick={() => this.setRecipient(recipientId)}
              primaryText={displayName}
              leftAvatar={unreadSymbol}
              rightIcon={<CommunicationChatBubble />}
            />
          )
        })}
      </div>
    }

    return (
      <List className="MessageHistorySideBar">
        <Subheader>Recent Messages</Subheader>
        {messageHistoryDisplay}
      </List>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    allMessages: state.allMessages,
    loggedInUser: state.loggedInUser,
    messageHistory: state.messageHistory,
    selectedMessages: state.selectedMessages
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    clearMessages: () => {
      const action = { type: 'CLEAR_MESSAGE_HISTORY' };
      dispatch(action);
    },

    setCurrentRecipient: (user) => {
      const action = { type: 'SET_CURRENT_RECIPIENT', user };
      dispatch(action);
    },

    setMessageHistory: (output) => {
      const action = { type: 'SET_MSG_HISTORY', output };
      dispatch(action);
    },

    updateNumOfUnreadMsgs: (num) => {
      const action = { type: 'UPDATE_NUM_OF_UNREAD_MSGS', num };
      dispatch(action);
    },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageHistorySideBar);
