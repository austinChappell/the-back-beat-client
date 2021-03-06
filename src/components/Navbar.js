import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { connect } from 'react-redux';
import io from "socket.io-client";

import ReactTooltip from 'react-tooltip';
import SiteSearch from './SiteSearch';

class Navbar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      performerRequests: false
    }

    this.socket = io(props.apiURL);

    this.socket.on('RECEIVE_INDIVIDUAL_MESSAGE', (data) => {
      // console.log('DATA', data);
      // console.log('THE PROPS', props);

      if (data.sender_id !== this.props.currentRecipient.id && data.sender_id !== this.props.loggedInUser.id) {
        this.markAsUnread(data.message_id);
        this.filterMessages();
      }

      this.getUnreadMessages();
      this.getMessageHistory();
    })

  }

  componentDidMount() {
    this.fetchMessagesAfterLogin();
    this.getMessageHistory();
    // TODO: Maybe move setUser out to UserAuth component
    // TODO: Store loggedInUser differently. The code immediately after this comment is not storing loggedInUser.
    // if (this.props.authorized) {
    //   this.setUser();
    // }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  fetchPerformerRequests = () => {

    const apiURL = this.props.apiURL;

    const fetchData = () => {

      fetch(`${apiURL}/api/performers/requests?token=${localStorage.token}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',

        },
      }).then((response) => {
        return response.json();
      }).then((results) => {
        if (results.rows.length > 0 && this.state.performerRequests === false) {
          this.setState({ performerRequests: true });
        } else if (results.rows.length === 0 && this.state.performerRequests === true) {
          this.setState({ performerRequests: false });
        }
      })

    }

    fetchData();

    this.stopPerfReqFetch = setInterval(() => {
      fetchData();
    }, 5000);

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
      this.getMessageHistory();
    })
  }

  fetchMessagesAfterLogin = () => {
    if (this.props.loggedInUser.id && this.props.loggedInUser.is_active) {
      this.getUnreadMessages();
      this.fetchPerformerRequests();
      this.fetchAllMessages();
    } else {
      setTimeout(() => {
        this.fetchMessagesAfterLogin();
      }, 1000);
    }
  }

  filterMessages = () => {

    console.log('FILTERING MESSAGES');

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

  getMessageHistory = () => {

    // this.stopFetch = setInterval(() => {

      const output = [];
      const messages = this.props.allMessages;
      const loggedInUser = this.props.loggedInUser;
      console.log('MESSAGE HISTORY SIDEBAR FROM NAVBAR', messages, loggedInUser);
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
    // }, 1000)
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
      this.fetchAllMessages();
      // this.setState({ numOfUnreadMessages: results.rows.length });
    })

  }

  markAsUnread = (id) => {

    console.log('MARKING AS UNREAD');

    const apiURL = this.props.apiURL;

    fetch(`${apiURL}/message/${id}/markasunread?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT'
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('RESULTS', results.rows);
      this.getUnreadMessages();
      this.getMessageHistory();
      this.socket.emit('MARK_MESSAGE_UNREAD');
    }).catch((err) => {
      console.error('MARK AS READ ERROR', err);
    })
  }

  setUser = () => {
    const url = this.props.apiURL;
    fetch(`${url}/myprofile?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
    }).then((response) => {
      return response.json();
    }).then((results) => {
      // console.log('PROFILE RESULTS', results.rows[0]);
      const loggedInUser = results.rows[0];
      // console.log('LOGGED IN USER', loggedInUser);
      this.props.addLoggedInUser(loggedInUser);
    })
  }

  logout = () => {
    clearInterval(this.stopMsgFetch);
    clearInterval(this.stopPerfReqFetch);
    this.props.logout();
  }

  render() {

    let leftNavBarItems = this.props.authorized ?
    <div className="left">
      <NavLink className="brand-name" to="/" exact><img src={require("../assets/images/logo.png")} alt="logo" /></NavLink>
      <SiteSearch />
    </div>
    :
    <div className="left">
      <NavLink className="brand-name" to="/" exact><img src={require("../assets/images/logo.png")} alt="logo" /></NavLink>
    </div>

    let rightNavBarItems = this.props.authorized ?
    <div className="right">
      <NavLink to={`/myprofile`} data-tip="Profile">
        <i className="fa fa-user" aria-hidden="true"></i> {this.props.username}
      </NavLink>
      <NavLink to="/" exact data-tip="Home">
        <i className="fa fa-home" aria-hidden="true"></i>
      </NavLink>
      <NavLink to="/calendar" data-tip="Calendar">
        <i className="fa fa-calendar" aria-hidden="true"></i>
      </NavLink>
      <NavLink className="relative-navlink" to="/messages" data-tip="Messages">
        <i className="fa fa-envelope" aria-hidden="true"></i>
        <i className={this.props.numOfUnreadMessages > 0 ? "fa fa-circle" : "fa fa-circle hidden"} aria-hidden="true"></i>
      </NavLink>
      <NavLink className="relative-navlink" to="/performed_with" data-tip="Performers">
        <i className="fa fa-music" aria-hidden="true"></i>
        <i className={this.state.performerRequests ? "fa fa-circle" : "fa fa-circle hidden"} aria-hidden="true"></i>
      </NavLink>
      <span onClick={this.logout}>
        <NavLink to="/login">Logout</NavLink>
      </span>
      <ReactTooltip delayShow={100} />
    </div>
    :
    <div className="right">
      <HashLink to="/#features">Features</HashLink>
      <HashLink to="/#contact">Contact</HashLink>
      <span className="button-link" onClick={this.props.toggleUserAuthForm}>Login</span>
    </div>

    return (
      <div className={this.props.authorized ? "Navbar logged-in" : "Navbar logged-out"}>
        {leftNavBarItems}
        {rightNavBarItems}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allMessages: state.allMessages,
    apiURL: state.apiURL,
    authorized: state.authorized,
    currentRecipient: state.currentRecipient,
    loggedInUser: state.loggedInUser,
    numOfUnreadMessages: state.numOfUnreadMessages,
    showUserAuthForm: state.showUserAuthForm,
    userAuthType: state.userAuthType,
    username: state.currentUsername
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addLoggedInUser: (user) => {
      const action = { type: 'ADD_LOGGED_IN_USER', user };
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

    toggleUserAuthForm: () => {
      const action = { type: 'TOGGLE_USER_AUTH_FORM', userAuthType: 'Login' };
      dispatch(action);
    },

    updateNumOfUnreadMsgs: (num) => {
      const action = { type: 'UPDATE_NUM_OF_UNREAD_MSGS', num };
      dispatch(action);
    },

    logout: () => {
      const action = { type: 'LOGOUT' };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
