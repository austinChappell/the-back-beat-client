import React, { Component } from 'react';
import { connect } from 'react-redux';

class Logout extends Component {

  componentDidMount() {
  }

  render() {
    const url = this.props.apiURL;
    fetch(`${url}/logout`, {
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
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
    apiURL: state.apiURL,
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
