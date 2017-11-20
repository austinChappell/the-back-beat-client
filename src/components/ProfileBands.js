import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ProfileBands extends Component {

  // TODO: START BACK HERE. CURRENT USER EVENTS WILL RPOBABLY NEED TO BE STORED IN REDUX. THIS IS ALSO RELATED TO THE BUG WHEN NOT CHANGING BACK TO LOGGED IN USER INFO

  state = {
    bands: []
  }

  componentDidMount() {
    this.fetchUserBands();
  }

  fetchUserBands = () => {
    const url = this.props.apiURL;
    fetch(`${url}/api/bands/user/${this.props.currentUser.id}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log(results.rows);
      this.setState({ bands: results.rows });
    })
  }

  render() {
    return (
      <div className="ProfileBands">
        <div className="band-results">
          {this.state.bands.map((band, index) => {
            return (
              <div key={index} className="band">
                <h3><Link to={`/band/${band.band_id}`}>{band.band_name}</Link> - {band.band_genre}</h3>
                <h4>{band.band_city}</h4>
                <p>{band.band_description}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBands);
