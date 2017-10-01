import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    console.log('COMPONENT UNMOUNTING');
    // this.setState({ fetchHistory: false }, () => console.log('STATE AFTER COMPONENT UNMOUNTING', this.state));
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

    let stopFetch = setInterval(() => {
      console.log('MESSAGE HISTORY SIDEBAR');

      // if (this.props.fetchHistory === true) {

        // console.log('THIS IS STILL RUNNING');

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
        // console.log('ALL MESSAGES LENGTH', messages.length);
        // console.log('MESSAGE HISTORY', output);
        this.props.setMessageHistory(output);
        // this.setState({ messageHistory: output })

      // } else {
      //   console.log('THIS RAN');
      //   clearInterval(stopFetch);
      // }
    }, 1000)
  }

  render() {

    let messageHistoryDisplay = null;

    if (this.props.messageHistory.length > 0) {
      messageHistoryDisplay = <div>
        {this.props.messageHistory.map((message, index) => {
          let recipientId;
          let displayName;
          let msgPreview;
          if (message.sender_id === this.props.loggedInUser.id) {
            displayName = message.recipient_name;
            recipientId = message.recipient_id;
          } else {
            displayName = message.sender_name;
            recipientId = message.sender_id;
          }
          if (message.message_text.length > 40) {
            msgPreview = message.message_text.slice(0, 40) + '...';
          } else {
            msgPreview = message.message_text;
          }
          return (
            <div className={!message.read && message.recipient_id === this.props.loggedInUser.id ? "message-history-result unread" : "message-history-result"} key={index} onClick={() => this.setRecipient(recipientId)}>
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
    apiURL: state.apiURL,
    allMessages: state.allMessages,
    loggedInUser: state.loggedInUser,
    messageHistory: state.messageHistory
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
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
