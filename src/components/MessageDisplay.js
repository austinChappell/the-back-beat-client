import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageDisplay extends Component {

  sendMessage = () => {
    const api = this.props.apiURL;
    fetch(`${api}/message/send`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ message: this.props.currentMessage, recipientId: this.props.currentRecipient.id })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('RESULTS', results.rows);
      this.getMessages(this.props.currentRecipient);
      this.props.clearCurrentMessageText();
    })
  };

  getMessages = (user) => {
    const url = this.props.apiURL;
    fetch(`${url}/messages/${user.id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('RESULTS', results.rows);
      this.props.setCurrentRecipientAndMessages(user, results.rows);
    })
  }

  render() {
    const loggedInUserId = this.props.loggedInUser.id;
    console.log('MY ID', loggedInUserId);
    const recipient = this.props.currentRecipient ? <h2>{this.props.currentRecipient.first_name} {this.props.currentRecipient.last_name}</h2> : null;
    let messageDisplay;

    if (recipient !== null) {
      messageDisplay = <div className="message-box">
        <div className="currentRecipient">
          {recipient}
        </div>
        <div className="messages">
          {this.props.selectedMessages.map((message, index) => {
            return (
              <div key={index} className={message.sender_id === loggedInUserId ? "message sent" : "message received"}>
                <div className={message.sender_id === loggedInUserId ? "message-wrapper sent" : "message-wrapper received"}>
                  <p>{message.message_text}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="message-editor">
          <textarea value={this.props.currentMessage} onChange={(evt) => this.props.handleChange(evt)}></textarea>
          <button onClick={this.sendMessage}>Send</button>
        </div>
      </div>
    } else {
      messageDisplay = <div>
        <h1>Looking to hire someone for a gig? Want to find out where your friends are playing next? Write them a message!</h1>
      </div>
    }

    return (
      <div className="MessageDisplay">
        {messageDisplay}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
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
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDisplay);
