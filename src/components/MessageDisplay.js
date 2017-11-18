import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageDisplay extends Component {

  state = {
    numOfSelectedMessages: 0
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
  }

  sendMessage = (evt) => {
    // if (evt) {
      evt.preventDefault();
    // }
    const api = this.props.apiURL;
    fetch(`${api}/message/send`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
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
    })
  };

  handleChange = (evt) => {
    console.log(evt.target.value);
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
      <form className="message-editor" onSubmit={(evt) => this.sendMessage(evt)}>
        <input className={recipient ? '' : 'disabled'} value={this.props.currentMessage} onChange={(evt) => this.handleChange(evt)} disabled={recipient === null}></input>
        <button
          className={recipient === null ? "send-message-button disabled" : "send-message-button"}
          disabled={recipient === null}>Send</button>
      </form>
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
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDisplay);
