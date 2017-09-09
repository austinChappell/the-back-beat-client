import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

class Navbar extends Component {
  render() {
    return (
      <div className="Navbar">
        <div className="left">
          <NavLink className="brand-name" to="/" exact><img src={require("../assets/images/logo.png")} alt="logo" /></NavLink>
        </div>
        <div className="right">
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <span className="button-link" onClick={this.props.toggleUserAuthForm}>Login</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showUserAuthForm: state.showUserAuthForm,
    userAuthType: state.userAuthType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleUserAuthForm: () => {
      const action = { type: 'TOGGLE_USER_AUTH_FORM', userAuthType: 'Login' };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
