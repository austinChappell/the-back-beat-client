import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class BandBox extends Component {

  state = {
    bands: []
  }

  componentDidMount() {

    setTimeout(() => {
      this.getBandLoop();
    }, 100);

  }

  getBandLoop = () => {
    if (this.props.loggedInUser.id) {
      this.getBands();
    } else {
      setTimeout(() => {
        this.getBandLoop();
      }, 100);
    }
  }

  getBands = () => {

    const url = this.props.apiURL;
    const userId = this.props.loggedInUser.id;
    fetch(`${url}/api/bands/user/${userId}?&token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bands: results.rows }, () => {
        console.log(this.state);
      });
    })

  };

  render() {
    return (
      <div className="BandBox">
        <h2>Your Bands</h2>
        <p className="create-band-link">Want to start one? <Link to="/band/create">Create your own!</Link></p>
        <div className="band-results">
          {this.state.bands.map((band, index) => {
            return (
              <div key={index} className="band">
                <h3><Link
                  style={{fontWeight: '400'}}
                  to={`/band/${band.band_id}`}>{band.band_name}</Link></h3>
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
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandBox);
