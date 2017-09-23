import React, { Component } from 'react';
import { connect } from 'react-redux';

import MessageDisplay from './MessageDisplay';
import MessageHistorySideBar from './MessageHistorySideBar';
import MessageSearchBar from './MessageSearchBar';

class MessagePage extends Component {

  state = {
    currentRecipient: {},
    fetchHistory: true,
    messageHistory: [],
    searchBarActive: false,
    searchValue: '',
    users: []
  }

  componentDidMount() {
    this.props.clearCurrentRecipient();
    const url = this.props.apiURL;
    const fetchAllMessages = () => {
      fetch(`${url}/messages/all`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((results) => {
        // console.log('ALL MESSAGES', results.rows);
        this.props.setAllMessages(results.rows);
        this.getMessageHistory();
      })
    }

    fetchAllMessages();
    setInterval(() => {
      fetchAllMessages();
      if (this.props.currentRecipient && this.state.searchBarActive === false) {
        this.filterMessages(this.props.currentRecipient);
      }
    }, 100);
  }

  componentDidUnmount() {
    console.log('MESSAGE PAGE IS UNMOUNTING');
    this.stopFetch();
  }

  stopFetch = () => {
    console.log('STOP FETCH RUNNING');
    this.setState({ searchBarActive: true, fetchHistory: false },
    () => {
      console.log('THE STATE IS ', this.state);
    });
  }

  getMessageHistory = () => {

    let stopFetch = setInterval(() => {

      if (this.state.fetchHistory === true) {

        console.log('THIS IS STILL RUNNING');

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
        this.setState({ messageHistory: output })

      } else {
        console.log('THIS RAN');
        clearInterval(stopFetch);
        // this.setState({ messageHistory: [] });
      }
    })
  }

  filterMessages = (user) => {
    let newUser = user;
    // this.props.setCurrentRecipient(newUser);
    this.setState({ searchBarActive: false, fetchHistory: true });
    // let stopFetch = setInterval(() => {

      // if (this.state.searchBarActive === true) {
      //   clearInterval(stopFetch);
      //   console.log('THIS RAN');
      // }

      if (this.props.currentRecipient) {

        newUser = this.props.currentRecipient;

        const filteredMessages = [];
        this.props.allMessages.map((message) => {
          if (message.sender_id === newUser.id || message.recipient_id === newUser.id) {
            filteredMessages.push(message);
          }
        });
        filteredMessages.map((message) => {
          if (message.read === false && message.sender_id === newUser.id) {
            message.read = true;
            fetch(`${this.props.apiURL}/message/${message.message_id}/markasread`, {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'PUT'
            })
          }
        })
        this.props.setCurrentMessages(filteredMessages);
        // console.log('FILTERED MESSAGES', filteredMessages);

      }

    // }, 100);


  }

  fetchUsers = () => {
    const url = this.props.apiURL;
    const val = this.state.searchValue;
    fetch(`${url}/api/searchusernames/${val}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log('THIS IS THE RESPONSE SECTION');
      return response.json();
    }).then((results) => {
      this.setState({ users: results.rows });
    })
  }

  handleChange = (evt) => {
    console.log('changed', evt.target.value);
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

  setCurrentRecipient = (user) => {
    console.log('USER', user);
  }

  render() {
    return (
      <div className="MessagePage">
        <MessageSearchBar stopFetch={this.stopFetch} />
        <MessageDisplay currentRecipient={this.state.currentRecipient} />
        <MessageHistorySideBar messageHistory={this.state.messageHistory} />
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
    messageSearchBarVal: state.messageSearchBarVal,

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearCurrentRecipient: () => {
      const action = { type: 'CLEAR_CURRENT_RECIPIENT' };
      dispatch(action);
    },

    setAllMessages: (allMessages) => {
      const action = { type: 'SET_ALL_MESSAGES', allMessages };
      dispatch(action);
    },

    setCurrentRecipient: (user) => {
      const action = { type: 'SET_CURRENT_RECIPIENT', user };
      dispatch(action);
    },

    setCurrentMessages: (messages) => {
      const action = { type: 'SET_CURRENT_MESSAGES', messages };
      dispatch(action);
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage);
