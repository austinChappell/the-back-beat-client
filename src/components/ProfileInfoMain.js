import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileInfoMain extends Component {

  // state = {
  //   userInstruments: []
  // }
  //
  // componentDidMount() {
  //
  //   const url = this.props.apiURL;
  //   fetch(`${url}/api/instrumentuser/${this.props.user.id}`, {
  //     credentials: 'include',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then((response) => {
  //     return response.json();
  //   }).then((results) => {
  //     console.log('INSTRUMENTS', results.rows);
  //     this.props.addInstrumentsToCurrentUser(results.rows);
  //     this.setState({ userInstruments: results.rows })
  //   })
  //
  // }

  render() {

    const user = this.props.user;
    return (
      <div className="ProfileInfoMain">
        <div className="profile-info">
          <h3>{user.first_name} {user.last_name}</h3>
          <h4>Email: {user.email}</h4>
          <h4>City: {user.city}</h4>
          <h4>Skill Level: {user.skill_level}</h4>
          <h4>Instruments: </h4>
          <div className="user-instruments">
            {this.props.instruments.map((instrument, index) => {
              return <span key={index} id={instrument.instrument_id}>{instrument.name}</span>
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
