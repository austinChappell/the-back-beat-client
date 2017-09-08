import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SignUpForm extends Component {
  render() {
    return (
      <div className="SignUpForm">
        <input type="text" name="first_name" placeholder="First Name" />
        <input type="text" name="last_name" placeholder="Last Name" />
        <input type="email" name="email" placeholder="Email" />
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <select name="city">
          <option value="">City...</option>
          <option value="AustinTX">Austin, TX</option>
          <option value="DallasTX">Dallas, TX</option>
        </select>
        <div className="form-footer">
          <button>Sign Up!</button>
          <p><span>Already have an account?</span><Link to="/login">Login</Link></p>
        </div>
      </div>
    )
  }
}

export default SignUpForm;
