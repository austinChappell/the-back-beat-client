import React, { Component } from 'react';

class Message extends Component {
  render() {
    const message = this.props.message;
    return (
      <div className="message">
        <div className={this.props.dateClass}>
          <hr />
          <span>{message.date}</span>
          <hr />
        </div>
        <div className="time">
          <div className="user">
            <img src={message.profile_image_url} alt={message.first_name} /><span>{message.first_name} {message.last_name}</span>
          </div>
          <div className="time-stamp">
            <span>{message.time}</span>
          </div>
        </div>
        <p>{message.content}</p>
      </div>
    )
  }
}

export default Message;
