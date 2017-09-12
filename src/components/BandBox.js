import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class BandBox extends Component {
  render() {
    return (
      <div className="BandBox">
        <h2>Your Bands</h2>
        <div className="band-results">
          {this.props.userBands.map((band, index) => {
            return (
              <div key={index} className="band">
                <h3><Link to={band.url}>{band.name}</Link></h3>
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
    userBands: state.userBands
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandBox);
