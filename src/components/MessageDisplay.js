import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageDisplay extends Component {

  constructor() {
    super();

    this.state = {
      messages: []
    }
  }

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
    })
  };

  getMessages = () => {
    const url = this.props.apiURL;
    fetch(`${url}/messages/${this.props.currentRecipient.id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('RESULTS FROM GET MESSAGES', results.rows);
      this.setState({messages: results.rows});
    })
  }

  render() {
    const loggedInUserId = this.props.loggedInUser.id;
    console.log('MY ID', loggedInUserId);
    const recipient = this.props.currentRecipient ? <h2>{this.props.currentRecipient.first_name} {this.props.currentRecipient.last_name}</h2> : null;
    return (
      <div className="MessageDisplay">
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
    handleChange: (evt) => {
      const action = { type: 'UPDATE_CURRENT_MESSAGE', val: evt.target.value };
      dispatch(action);
    },

    resetMessage: () => {
      const action = { type: 'RESET_CURRENT_MESSAGE' };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDisplay);
