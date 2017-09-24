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
      console.log('DID MOUNT', this.props);
      this.setState({ bandInfo: results.rows[0] }, () => console.log('BAND INFO', this.state.bandInfo));
    })
  }

  render() {

    console.log('COMPONENT RENDERED', this.props);

    const bandInfo = this.state.bandInfo;
    console.log('BAND INFO', bandInfo);
    console.log('ADMIN ID', bandInfo.admin_id);
    console.log('PARAMS ID', this.props.match.params.adminId);

    if (bandInfo.band_admin_id !== undefined && bandInfo.band_admin_id != this.props.match.params.adminId) {
      this.props.history.goBack();
    }
    // console.log('LOGGED IN USER ID', this.props.loggedInUser.id);
    // console.log('ADMIN ID', this.props.match.params.adminId);

    if (this.props.loggedInUser.id != this.props.match.params.adminId) {
      this.props.history.goBack();
    }

    // console.log('THE PROPS', this.props.match.params.bandId);

    return (
      <div className="BandPageBrowseMusicians">
        <h1>Search for musicians in {bandInfo.city} to join {bandInfo.band_name}.</h1>
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

export default connect(mapStateToProps, mapDispatchToProps)(BandPageBrowseMusicians);
