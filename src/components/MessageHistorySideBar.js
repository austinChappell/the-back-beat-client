import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageHistorySideBar extends Component {

  state = {
    messageHistory: []
  }

  componentDidMount() {
    let stopFetch = setInterval(() => {
      this.getMessageHistory();
    }, 2000);
  }

  getMessageHistory = () => {
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
    console.log('ALL MESSAGES LENGTH', messages.length);
    console.log('MESSAGE HISTORY', output);
    this.setState({ messageHistory: output })
  }

  render() {

    let messageHistoryDisplay = null;

    if (this.state.messageHistory.length > 0) {
      messageHistoryDisplay = <div>
        {this.state.messageHistory.map((message) => {
          let displayName;
          let msgPreview;
          if (message.sender_id === this.props.loggedInUser.id) {
            displayName = message.recipient_name;
          } else {
            displayName = message.sender_name;
          }
          if (message.message_text.length > 40) {
            msgPreview = message.message_text.slice(0, 40) + '...';
          } else {
            msgPreview = message.message_text;
          }
          return (
            <div>
              <h4>{displayName}</h4>
              <p>{msgPreview}</p>
            </div>
          )
        })}
      </div>
    }

    return (
      <div className="MessageHistorySideBar">
        {messageHistoryDisplay}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allMessages: state.allMessages,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageHistorySideBar);
