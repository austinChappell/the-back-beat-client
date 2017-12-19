import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from "socket.io-client";

import MessageInput from './MessageInput';
import SideBar from './SideBar';

class BandChat extends Component {

  constructor(props) {
    super(props);

    const bandId = props.match.params.bandId;

    this.state = {
      bandAdminId: null,
      bandId: props.match.params.bandId,
      bandInfoArr: [],
      members: [],
      messages: [],
      sideBarLinks: [
        { title: 'Band Info', path: `/band/${bandId}` },
        { title: 'Dashboard', path: `/band/${bandId}/dashboard` },
        { title: 'Calendar', path: `/band/${bandId}/calendar` },
        { title: 'Uploads', path: `/band/${bandId}/uploads` },
        { title: 'Chat', path: `/band/${bandId}/chat` }
      ],
    }

    this.socket = io(this.props.apiURL);

    this.socket.on('RECEIVE_MESSAGE', () => {
      this.getMessages();
    })

  }


  componentDidMount() {
    this.getMembers();
    this.getMessages();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  // TODO: Check this. there might be an issue with this.state.bandId
  getMembers = () => {
    const apiURL = this.props.apiURL;
    const bandId = this.state.bandId;
    fetch(`${apiURL}/api/band/${bandId}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      let members = [];
      results.rows.forEach((member) => {
        members.push({
          city: member.city,
          id: member.id,
          instrument_id: member.instrument_id,
          first_name: member.first_name,
          last_name: member.last_name,
          profile_image_url: member.profile_image_url
        });
      })
      this.setState({ bandInfoArr: results.rows, members });
      this.setState({ bandAdminId: results.rows[0].band_admin_id });
    }).catch((err) => {
      console.log('getmembers error', err);
    })
  }

  getMessages = () => {
    const apiURL = this.props.apiURL;
    const bandId = this.state.bandId;
    fetch(`${apiURL}/api/band/${bandId}/messages/?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('results', results.rows);
      this.setState({ messages: results.rows }, () => {
        this.refs.chatWindow.scrollTop = this.refs.chatWindow.scrollHeight;
      });
    }).catch((err) => {
      console.log('getmessages error', err);
    })
  }

  sendMessage = (message) => {
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/band/message/new?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        bandId: this.state.bandId,
        date: new Date(),
        message,
        senderId: this.props.loggedInUser.id
      })
    }).then(() => {
      this.getMessages();
      this.setState({ currentMessage: '' });
      this.socket.emit('SEND_MESSAGE');
    }).catch((err) => {
      console.log('sendMessage error', err);
    })

  }

  render() {

    const now = new Date();
    const today = now.toDateString();

    return (
      <div className="BandChat">
        <SideBar
          links={this.state.sideBarLinks}
          url={this.props.match.url}
        />
        <section className="chat-section">
          <div className="chat-window" ref="chatWindow">
            {this.state.messages.map((message, index) => {
              const date = new Date(message.created_at);
              if (date.toDateString() === today) {
                message.date = 'Today';
              } else {
                message.date = date.toDateString();
              }
              message.time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              let dateClass = 'date';
              for (let i = 0; i < index; i++) {
                if (this.state.messages[i].date === message.date) {
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
                  <p>{message.content}</p>
                </div>
              )
            })}

          </div>
          <MessageInput
            bandId={this.props.match.params.bandId}
            parentName="BandChat"
            sendMessage={this.sendMessage}
          />
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandChat);
