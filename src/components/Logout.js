import React, { Component } from 'react';
import { connect } from 'react-redux';

class Logout extends Component {

  componentDidMount() {
  }

  render() {
    fetch('http://localhost:6001/logout', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({})
    }).then(() => {
      this.props.logout();
    })
    return (
      <div className="Logout"></div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authorized: state.authorized
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      console.log('HELLO FROM THE DISPATCH');
      const action = { type: 'LOGOUT' };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
