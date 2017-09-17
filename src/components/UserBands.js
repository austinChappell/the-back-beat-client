import React, { Component } from 'react';
import { connect } from 'react-redux';

class UserBands extends Component {

  constructor() {
    super();

    this.state = {
      bands: []
    }
  }

  componentDidMount() {
    // const url = this.props.apiURL;
    // fetch(`${url}/api/user/bands`, {
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then((response) => {
    //   return response.json();
    // }).then((results) => {
    //   console.log('FETCH BANDS RESULTS', results);
    //   this.setState({ bands: results.rows });
    // })
  }

  render() {
    return (
      <div className="UserBands">
        {this.props.bands.map((band) => {
          return (
            <div key={band.band_id} className="single-band">
              <h2>{band.band_name}</h2>
              <h3>{band.band_city}</h3>
              <h3>{band.band_genre}</h3>
              <h3>{band.band_skill_level}</h3>
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

export default connect(mapStateToProps)(UserBands);
