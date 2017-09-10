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
      <div className="form-inputs">
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'username')}
          value={this.props.userInfo.username} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'password')}
          value={this.props.userInfo.password} />
      </div>
      :
      <div className="form-inputs">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'firstName')}
          value={this.props.userInfo.firstName} />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'lastName')}
          value={this.props.userInfo.lastName} />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'email')}
          value={this.props.userInfo.email} />
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'username')}
          value={this.props.userInfo.username} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'password')}
          value={this.props.userInfo.password} />
        <select
          name="city"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'city')}
          value={this.props.userInfo.city}>
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
            <button onClick={() => {
              const userInfo = {
                city: this.props.city,
                email: this.props.email,
                firstName: this.props.firstName,
                lastName: this.props.lastname,
                password: this.props.password,
                username: this.props.username
              };
              this.props.submitForm(this.props.userAuthType, userInfo);
            }
            }>{this.props.userAuthType}</button>
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
    userAuthType: state.userAuthType,
    userInfo: state.userInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    handleFormInputChange: (evt, input) => {
      const action = { type: 'HANDLE_FORM_INPUT_CHANGE', input, value: evt.target.value }
      dispatch(action);
    },

    submitForm: (authType, userInfo) => {
      const action = { type: 'USER_AUTH_FORM_SUBMIT', authType, userInfo };
      dispatch(action);
    },

    toggleUserAuthForm: () => {
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
