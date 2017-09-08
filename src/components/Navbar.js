import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

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
          <NavLink className="button-link" to="/login">Login</NavLink>
        </div>
      </div>
    )
  }
}

export default Navbar;
