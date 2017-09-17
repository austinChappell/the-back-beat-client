import React, { Component } from 'react';
import { connect } from 'react-redux';

class BandPage extends Component {

  state = {
    bandInfoArr: []
  }

  componentDidMount() {
    const url = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${url}/api/band/${bandId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bandInfoArr: results.rows });
    })
  }

  render() {
    let bandData;
    if (this.state.bandInfoArr.length > 0) {
      bandData = this.state.bandInfoArr[0];
    }

    let bandInfo = bandData === undefined ? null :
    <div>
      <h1>{bandData.band_name} - <span>{bandData.band_city}</span></h1>
      <h2>Genre: {bandData.band_genre}</h2>
      <h3>Type: {bandData.band_skill_level}</h3>
      <p>{bandData.band_description}</p>
      <div className="members">
        <h3>Members:</h3>
        {this.state.bandInfoArr.map((member, index) => {
          let adminLabel = bandData.band_admin_id === member.id ? <span>(admin)</span> : null;
          return (
            <h4 key={index}>{member.first_name} {member.last_name} - {member.city} {adminLabel}</h4>
          )
        })}
      </div>
    </div>

    return (
      <div className="BandPage">
        {bandInfo}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

export default connect(mapStateToProps)(BandPage);
