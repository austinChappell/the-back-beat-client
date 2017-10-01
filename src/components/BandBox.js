import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class BandBox extends Component {

  state = {
    bands: []
  }

  componentDidMount() {

    const url = this.props.apiURL;
    fetch(`${url}/api/user/bands`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bands: results.rows });
    })

  }

  render() {
    return (
      <div className="BandBox">
        <h2>Your Bands</h2>
        <div className="band-results">
          {this.state.bands.map((band, index) => {
            return (
              <div key={index} className="band">
                <h3><Link to={`/band/${band.band_id}`}>{band.band_name}</Link></h3>
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandBox);
