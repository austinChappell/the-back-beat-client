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
      // this.getMessageHistory();
      console.log('MESSAGE PAGE PROPS FOR SOCKET', props);
      // if (this.props.currentRecipient.id !== undefined) {
      //   this.filterMessages();
      // }
    })

  }

  componentDidMount() {
    this.fetchAllMessages();
  }

  // componentWillReceiveProps() {
  //   this.fetchAllMessages();
  // }

  componentWillUnmount() {
    this.props.clearCurrentRecipient();
    this.props.clearSelectedMessages();
    this.socket.close();
  }

  fetchAllMessages = () => {
    console.log('FETCHING ALL MESSAGES');
    const apiURL = this.props.apiURL;

    fetch(`${apiURL}/messages/all?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('FETCHED MESSAGES', results.rows);
      this.props.setAllMessages(results.rows);
      this.getMessageHistory();
      if (this.props.currentRecipient.id !== undefined) {
        this.filterMessages();
      }
    })
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
    // this.setState({ messageHistory: output })
    this.props.setMessageHistory(output);

  }


  filterMessages = () => {

    console.log('FILTERING MESSAGES', this.props);

    if (this.props.currentRecipient.id !== undefined) {

      console.log('THERE IS AN ID', this.props.currentRecipient);

      let newUser = this.props.currentRecipient;

      const filteredMessages = [];
      this.props.allMessages.map((message) => {
        if (message.sender_id === newUser.id || message.recipient_id === newUser.id) {
          filteredMessages.push(message);
        }
      });

      console.log('newuserid', newUser.id);
      filteredMessages.map((message) => {
        // console.log('MESSAGE', message);
        if (message.read === false && message.sender_id === newUser.id) {
          message.read = true;
          fetch(`${this.props.apiURL}/message/${message.message_id}/markasread?token=${localStorage.token}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PUT'
          }).then((response) => {
            return response.json();
          }).then((results) => {
            this.getUnreadMessages();
          }).catch((err) => {
            console.error('FILTER MESSAGES ERROR', err);
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

    console.log('RENDER MESSAGE PAGE', this.props.currentRecipient.id);

    return (
      <div className="MessagePage">
        <MessageDisplay currentRecipient={this.state.currentRecipient} />
        <div style={{width: '300px'}}>
          <MessageSearchBar />
          <MessageHistorySideBar
            fetchAllMessages={this.fetchAllMessages}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage);
