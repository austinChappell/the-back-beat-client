import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from "socket.io-client";

import MessageDisplay from './MessageDisplay';
import MessageHistorySideBar from './MessageHistorySideBar';
import MessageSearchBar from './MessageSearchBar';

class MessagePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentRecipient: {},
      fetchHistory: true,
      messageHistory: [],
      searchBarActive: false,
      searchValue: '',
      users: []
    }

    this.socket = io(props.apiURL);

    this.socket.on('RECEIVE_INDIVIDUAL_MESSAGE', () => {
      this.fetchAllMessages();
      this.getMessageHistory();
      if (this.props.currentRecipient) {
        this.filterMessages();
      }
    })

  }


  componentDidMount() {
    // this.props.clearCurrentRecipient();

    this.fetchAllMessages();
    // this.stopFetch = setInterval(() => {
    // this.fetchAllMessages();
    // }, 1000);
  }

  componentWillReceiveProps() {
    this.fetchAllMessages();
  }

  fetchAllMessages = () => {
    const apiURL = this.props.apiURL;

    fetch(`${apiURL}/messages/all?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.setAllMessages(results.rows);
    })
    this.getMessageHistory();
    if (this.props.currentRecipient) {
      this.filterMessages();
    }
  }

  componentWillUnmount() {
    clearInterval(this.stopFetch);
    // this.props.clearCurrentRecipient();
    // this.props.clearSelectedMessages();
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
    this.setState({ messageHistory: output })

  }


  filterMessages = () => {

    if (this.props.currentRecipient) {

      let newUser = this.props.currentRecipient;

      const filteredMessages = [];
      this.props.allMessages.map((message) => {
        if (message.sender_id === newUser.id || message.recipient_id === newUser.id) {
          filteredMessages.push(message);
        }
      });

      filteredMessages.map((message) => {
        if (message.read === false && message.sender_id === newUser.id) {
          message.read = true;
          fetch(`${this.props.apiURL}/message/${message.message_id}/markasread?token=${localStorage.token}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',

            },
            method: 'PUT'
          })
        }
      })

      this.props.setCurrentMessages(filteredMessages);

    }

  }

  fetchUsers = () => {
    const url = this.props.apiURL;
    const val = this.state.searchValue;
    fetch(`${url}/api/searchusernames/${val}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ users: results.rows });
    })
  }

  handleChange = (evt) => {
    if (evt.target.value.length === 0) {
      this.setState({
        users: [],
        searchValue: ''
      })
    } else {
      this.setState({ searchValue: evt.target.value }, () => {
        this.fetchUsers();
      });
    }
  }

  render() {
    return (
      <div className="MessagePage">
        <MessageDisplay currentRecipient={this.state.currentRecipient} />
        <div style={{width: '300px'}}>
          <MessageSearchBar />
          <MessageHistorySideBar />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allMessages: state.allMessages,
    apiURL: state.apiURL,
    currentRecipient: state.currentRecipient,
    loggedInUser: state.loggedInUser,
    messageSearchBarVal: state.messageSearchBarVal
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearCurrentRecipient: () => {
      const action = { type: 'CLEAR_CURRENT_RECIPIENT' };
      dispatch(action);
    },

    clearSelectedMessages: () => {
      const action = { type: 'CLEAR_SELECTED_MESSAGES' };
      dispatch(action);
    },

    setAllMessages: (allMessages) => {
      const action = { type: 'SET_ALL_MESSAGES', allMessages };
      dispatch(action);
    },

    setCurrentMessages: (messages) => {
      const action = { type: 'SET_CURRENT_MESSAGES', messages };
      dispatch(action);
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage);
