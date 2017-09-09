import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class UserAuthForm extends Component {
  render() {

    let otherOption = this.props.userAuthType === 'Login' ?
      <p>
        <span>Need an account?</span>
        <span className="span-link" onClick={this.props.toggleUserAuthType}>Sign Up</span>
      </p>
      :
      <p>
        <span>Already have an account?</span>
        <span className="span-link" onClick={this.props.toggleUserAuthType}>Login</span>
      </p>

    let form = this.props.userAuthType === 'Login' ?
      <div>
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
      </div>
      :
      <div>
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
      </div>


    return (

      <div className={this.props.showUserAuthForm ? "UserAuthForm" : "hide"}>
        <span id="exit-button" onClick={this.props.toggleUserAuthForm}><i className="fa fa-times" aria-hidden="true"></i></span>
        <div className="form">
          {form}
          <div className="form-footer">
            <button onClick={() => this.props.submitForm(this.props.userAuthType)}>{this.props.userAuthType}</button>
            {otherOption}
          </div>
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

    submitForm: (authType) => {
      console.log('Form submitted with auth type of ', authType);
      const action = { type: 'USER_AUTH_FORM_SUBMIT', authType };
      dispatch(action);
    },

    toggleUserAuthForm: () => {
      console.log('hello');
      const action = { type: 'TOGGLE_USER_AUTH_FORM', userAuthType: '' };
      dispatch(action);
    },

    toggleUserAuthType: () => {
      const action = { type: 'TOGGLE_USER_AUTH_TYPE' };
      dispatch(action);
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAuthForm);
