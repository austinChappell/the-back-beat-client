import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from "socket.io-client";

import MessageInput from './MessageInput';

import SideBar from './SideBar';

class Chat extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentMessage: '',
      currentRecipient: null,
      messages: [],
      sideBarLinks: []
    }

    this.socket = io(this.props.apiURL);

    this.socket.on('RECEIVE_INDIVIDUAL_MESSAGE', () => {
      this.getMessages();
      this.filterMessages();
    })

  }

  componentDidMount() {
    this.populateSideBar();
    this.filterMessages();
  }

  filterMessages = () => {

    console.log('FILTER MESSAGES RUNNING');

    if (this.state.currentRecipient) {

      console.log('THERE IS A RECIPIENT');

      let newUser = this.state.currentRecipient;

      const filteredMessages = [];
      this.props.selectedMessages.map((message) => {
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
          }).then(() => {
            this.props.setCurrentMessages(filteredMessages);
          })
        }
      })


    }

  }

  getMessages = () => {
    const apiURL = this.props.apiURL;
    const recipientId = this.props.location.search.split('=')[1];
    this.setUser(recipientId);
    fetch(`${apiURL}/messages/${recipientId}/?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('results', results.rows);
      // this.setState({ messages: results.rows }, () => {
      //   this.refs.chatWindow.scrollTop = this.refs.chatWindow.scrollHeight;
      // });
      this.props.setCurrentMessages(results.rows);
      this.refs.chatWindow.scrollTop = this.refs.chatWindow.scrollHeight;
    }).catch((err) => {
      console.log('getmessages error', err);
    })
  }

  handleInputChange = (evt) => {
    this.setState({ currentMessage: evt.target.value });
  }

  handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      this.sendMessage();
    }
  }

  populateSideBar = () => {
    const sideBarLinks = [];
    this.props.messageHistory.forEach((message) => {
      let displayName;
      let recipientId;
      if (message.sender_id === this.props.loggedInUser.id) {
        displayName = message.recipient_name;
        recipientId = message.recipient_id;
      } else {
        displayName = message.sender_name;
        recipientId = message.sender_id;
      }
      const link = {
        title: displayName,
        path: `/chat?id=${recipientId}`
      }
      sideBarLinks.push(link);
    })
    this.setState({ sideBarLinks });
  }

  setUser = (id) => {
    console.log('SET USER RUNNING', id);
    const apiURL = this.props.apiURL;

    fetch(`${apiURL}/api/user/id/${id}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log('SET USER RESPONSE', response);
      return response.json();
    }).then((results) => {
      console.log('SET USER RESULTS', results);
      this.setState({ currentRecipient: results[0] });
    }).catch((err) => {
      console.log('SET USER ERROR', err);
    })
  }

  sideBarClick = () => {
    setTimeout(() => {
      this.getMessages();
      this.filterMessages();
    }, 0)
  }

  render() {

    const now = new Date();
    const today = now.toDateString();

    return (
      <div className="BandChat">
        <SideBar
          links={this.state.sideBarLinks}
          onClick={this.sideBarClick}
          url={this.props.match.url}
        />
        <section className="chat-section">
          <div className="chat-window" ref="chatWindow">
            {this.props.selectedMessages.map((message, index) => {
              const date = new Date(message.created_at);
              if (date.toDateString() === today) {
                message.date = 'Today';
              } else {
                message.date = date.toDateString();
              }
              message.time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              let dateClass = 'date';
              for (let i = 0; i < index; i++) {
                if (this.props.selectedMessages[i].date === message.date) {
                  dateClass = 'hide';
                }
              }
              return (
                <div className="message" key={index}>
                  <div className={dateClass}>
                    <hr />
                    <span>{message.date}</span>
                    <hr />
                  </div>
                  <div className="time">
                    <div className="user">
                      <img src={message.profile_image_url} /><span>{message.first_name} {message.last_name}</span>
                    </div>
                    <div className="time-stamp">
                      <span>{message.time}</span>
                    </div>
                  </div>
                  <p>{message.message_text}</p>
                </div>
              )
            })}

          </div>
          <MessageInput
            currentRecipient={this.state.currentRecipient}
          />
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser,
    messageHistory: state.messageHistory,
    selectedMessages: state.selectedMessages
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentMessages: (messages) => {
      const action = { type: 'SET_CURRENT_MESSAGES', messages };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
