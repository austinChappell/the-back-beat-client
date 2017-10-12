import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ProfileInfoMain extends Component {

  render() {

    const user = this.props.user;
    return (
      <div className="ProfileInfoMain">
        <div className="profile-info">
          <h4>{user.city}</h4>
          <h4>{user.skill_level}</h4>
          <h4>Instruments: </h4>
          <div className="user-instruments">
            {this.props.instruments.map((instrument, index) => {
              return <span key={index} id={instrument.instrument_id}>
                <Link to={`/city/${user.city}/instrument/${instrument.id}`}>{instrument.name}</Link>
              </span>
            })}
          </div>
        </div>
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
    addInstrumentsToCurrentUser: (instrumentArray) => {
      const action = { type: 'ADD_INSTRUMENTS_TO_CURRENT_USER', instrumentArray };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfoMain);
