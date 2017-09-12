import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { connect } from 'react-redux';

class Navbar extends Component {

  render() {
    let rightNavBarItems = this.props.authorized ?
    <div className="right">
      <NavLink to="/profile">
        <i className="fa fa-user" aria-hidden="true"></i> {this.props.username}
      </NavLink>
      <NavLink className="relative-navlink" to="/creatgroup">
        <i className="fa fa-music" aria-hidden="true"></i>
        <i className="fa fa-plus" aria-hidden="true"></i>
      </NavLink>
      <NavLink className="relative-navlink" to="/addtocalendar">
        <i className="fa fa-calendar" aria-hidden="true"></i>
        <i className="fa fa-plus" aria-hidden="true"></i>
      </NavLink>
      <NavLink to="/connect">
        <i className="fa fa-users" aria-hidden="true"></i>
      </NavLink>
      <NavLink to="/messages">
        <i className="fa fa-envelope" aria-hidden="true"></i>
      </NavLink>
      <span onClick={this.props.logout}><NavLink to="/login">Logout</NavLink></span>
    </div>
    :
    <div className="right">
      <HashLink to="/#features">Features</HashLink>
      <HashLink to="/#contact">Contact</HashLink>
      <span className="button-link" onClick={this.props.toggleUserAuthForm}>Login</span>
    </div>

    return (
      <div className={this.props.authorized ? "Navbar logged-in" : "Navbar logged-out"}>
        <div className="left">
          <NavLink className="brand-name" to="/" exact><img src={require("../assets/images/logo.png")} alt="logo" /></NavLink>
        </div>
        {rightNavBarItems}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authorized: state.authorized,
    showUserAuthForm: state.showUserAuthForm,
    userAuthType: state.userAuthType,
    username: state.currentUser.username
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleUserAuthForm: () => {
      const action = { type: 'TOGGLE_USER_AUTH_FORM', userAuthType: 'Login' };
      dispatch(action);
    },

    logout: () => {
      console.log('HELLO FROM THE DISPATCH');
      const action = { type: 'LOGOUT' };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
