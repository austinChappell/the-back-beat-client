import React, { Component } from 'react';
import { connect } from 'react-redux';

class BandChat extends Component {

  constructor(props) {
    super(props);

    this.state = {
      bandAdminId: null,
      bandId: props.match.params.bandId,
      bandInfoArr: [],
      currentMessage: '',
      members: []
    }

  }


  componentDidMount() {
    this.getMembers();
    this.getMessages();
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
      this.setState({ messages: results.rows });
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

  sendMessage = () => {
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
        message: this.state.currentMessage,
        senderId: this.props.loggedInUser.id
      })
    })
    this.setState({ currentMessage: '' });
  }

  render() {

    console.log('BAND CHAT STATE', this.state);

    return (
      <div className="BandChat">
        Band Chat Component
        <section className="chat-section">
          <div className="chat-window">

          </div>
          <input
            className="message-bar"
            onChange={(evt) => this.handleInputChange(evt)}
            onKeyUp={(evt) => this.handleKeyUp(evt)}
            type="text"
            value={this.state.currentMessage}
          ></input>
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
