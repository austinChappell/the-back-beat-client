import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageHistorySideBar extends Component {

  state = {
    messageHistory: []
  }

  componentDidUpdate() {
    this.getMessageHistory();
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

    // TODO: Change message table in DB to have a Full Name field of the sender/recipient. This will be used to efficiently display the name in the message history display, as opposed to calling an API to get their name with their ID.

    let messageHistoryDisplay = null;

    if (this.state.messageHistory.length > 0) {
      messageHistoryDisplay = <div>
        {this.state.messageHistory.map((message) => {
          return (
            <div>{message.sender_id}</div>
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
