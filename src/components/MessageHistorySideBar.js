import React, { Component } from 'react';
import { connect } from 'react-redux';

import Avatar from 'material-ui/Avatar';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class MessageHistorySideBar extends Component {

  state = {
    fetchHistory: true,
    messageHistory: []
  }

  componentDidMount() {
    // this.setState({fetchHistory: true});
    this.getMessageHistory();
  }

  componentWillUnmount() {
    clearInterval(this.stopFetch);
  }

  setRecipient = (id) => {
    const url = this.props.apiURL;
    fetch(`${url}/api/user/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.setCurrentRecipient(results);
    })
  }

  // TODO: FIND A WAY TO INITIALIZE THE FILTER MESSAGES FUNCTION IN MESSAGEPAGE COMPONENT WHILE PASSING IN THE USER AT THE TOP OF THE MESSAGE HISTORY LIST

  getMessageHistory = () => {

    this.stopFetch = setInterval(() => {
      console.log('MESSAGE HISTORY SIDEBAR');

      const output = [];
      const messages = this.props.allMessages;
      const loggedInUser = this.props.loggedInUser;
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
    }, 1000)
  }

  render() {

    const randomCache = Math.floor(Math.random() * 1000000);
    let messageHistoryDisplay = null;

    if (this.props.messageHistory.length > 0) {
      messageHistoryDisplay = <div>
        {this.props.messageHistory.map((message, index) => {
          let recipientId;
          let displayName;
          let msgPreview;
          let className;
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

          let imageSrc = `${this.props.apiURL}/files/profile_images/profile_image_${recipientId}.jpg?v=${randomCache}`;

          return (
            <ListItem
              className="message-history-result"
              key={index}
              onClick={() => this.setRecipient(recipientId)}
              primaryText={displayName}
              leftAvatar={
                <Avatar
                  src={imageSrc}
                  style={
                    unreadNotification ?
                      { border: '3px solid red', boxSizing: 'border-box' } :
                      { border: 'none' }
                    }
                />}
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
    messageHistory: state.messageHistory
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
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageHistorySideBar);
