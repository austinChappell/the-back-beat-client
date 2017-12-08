import React, { Component } from 'react';
import { connect } from 'react-redux';

class BandChat extends Component {

  state = {
    bandAdminId: null,
    bandInfoArr: [],
    members: []
  }

  componentDidMount() {
    this.getMembers();
  }

  getMembers = () => {
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
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
    })
  }

  render() {

    console.log('BAND CHAT STATE', this.state);

    return (
      <div className="BandChat">
        Band Chat Component
        <section className="chat-section">
          <div className="chat-window">

          </div>
          <input className="message-bar" type="text">

          </input>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandChat);
