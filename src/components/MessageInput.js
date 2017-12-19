import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from "socket.io-client";

class MessageInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      inputValue: ''
    }

    this.socket = io(this.props.apiURL);

  }

  componentDidMount() {
    this.socket.on('NOTIFY_TYPING', (user) => {
      // console.log('TYPING', user);
      console.log(this.props)
      console.log(user);
      const isFromBandChat = this.props.parentName === 'BandChat' && user.bandId === this.props.bandId && user.id !== this.props.loggedInUser.id;
      const isFromMessage = this.props.parentName === 'MessageDisplay' && this.props.currentRecipient.id === user.id;
      const fromSameParent = user.parentName === this.props.parentName;
      const notFromSelf = user.id !== this.props.loggedInUser.id;
      console.log('FROM SAME PARENT', fromSameParent);
      if (fromSameParent && notFromSelf) {
        if (isFromMessage || isFromBandChat) {
          clearTimeout(this.cancelTimeout);
          this.setState({ userIsTyping: true, userTyping: `${user.firstName} ${user.lastName}` }, () => {
            this.cancelTimeout = setTimeout(() => {
              this.setState({ userIsTyping: false, userTyping: null });
            }, 2000);
          })
        }
      }
    })

    this.socket.on('REMOVE_TYPING_USER', () => {
      this.setState({ userIsTyping: false, userTyping: null });
    })
  }

  componentWillUnmount() {
    this.socket.close();
  }

  clearCurrentMessageText = () => {
    this.setState({ inputValue: '' });
  }

  handleChange = (evt) => {
    this.setState({ inputValue: evt.target.value })
    this.socket.emit('MESSAGE_TYPING', {
      firstName: this.props.loggedInUser.first_name,
      lastName: this.props.loggedInUser.last_name,
      id: this.props.loggedInUser.id,
      bandId: this.props.bandId,
      parentName: this.props.parentName
    })
  }

  handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      this.socket.emit('STOP_TYPING');
      this.props.sendMessage(this.state.inputValue);
      this.clearCurrentMessageText();
    }
  }

  render() {

    const userTyping = this.state.userIsTyping ? <span>{this.state.userTyping} is typing</span> : null;

    return (
      <div className="MessageInput">
        <input
          className="message-bar"
          onChange={(evt) => this.handleChange(evt)}
          onKeyUp={(evt) => this.handleKeyUp(evt)}
          value={this.state.inputValue}
        />
        <br />
        {userTyping}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    currentRecipient: state.currentRecipient,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput);
