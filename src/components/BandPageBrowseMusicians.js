import React, { Component } from 'react';
import { connect } from 'react-redux';

class BandPageBrowseMusicians extends Component {

  state = {
    bandInfo: {}
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
      this.setState({ bandInfo: results.rows[0] });
    })
  }

  findSkillIndex = () => {
    return this.props.skillLevels.indexOf(this.state.bandInfo.band_skill_level);
  }

  render() {

    const bandInfo = this.state.bandInfo;
    let skillIndex;

    if (bandInfo.band_admin_id !== undefined && bandInfo.band_admin_id != this.props.match.params.adminId) {
      this.props.history.goBack();
    }

    if (this.props.loggedInUser.id != this.props.match.params.adminId) {
      this.props.history.goBack();
    }

    if (bandInfo.band_skill_level) {
      skillIndex = this.findSkillIndex();
    }

    return (

      <div className="BandPageBrowseMusicians">
        <h1>Search for musicians in {bandInfo.city} to join {bandInfo.band_name}.</h1>
        <p>The skill index is {skillIndex}</p>
      </div>

    )

  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser,
    skillLevels: state.skillLevels
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandPageBrowseMusicians);
