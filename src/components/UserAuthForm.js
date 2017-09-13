import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class UserAuthForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      flashMessages: [
        { type: 'usernameTaken', message: 'The username and/or email address is already taken.' },
        { type: 'invalidCredentials', message: 'The username and/or password entered is incorrect.' }
      ],
      errorMessage: null
    }
  }

  exitForm = () => {
    this.setState({ errorMessage: null });
    this.props.toggleUserAuthForm();
  }

  changeForm = () => {
    this.setState({ errorMessage: null });
    this.props.toggleUserAuthType();
  }

  submitForm = (evt, userInfo) => {
    evt.preventDefault();
    // this.props.attemptLogin();
    const submitType = this.props.userAuthType === 'Login' ? 'login' : 'signup';
    console.log('type is', submitType);
    console.log('user info is ', userInfo);
    fetch(`http://localhost:6001/${submitType}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(userInfo)
    }).then((response) => {
      console.log('MIDLLE OF FETCH');
      return response.json();
    }).then((results) => {
      const data = results;
      console.log('DATA', data);
      console.log('FUNCTION PROPS', this.props.newProps);
      this.props.clearUserInfo(userInfo.username);
      if (submitType === 'login') {
        this.props.newProps.history.push('/');
      } else if (submitType === 'signup') {
        this.props.newProps.history.push('/profile');
      } else {
        this.props.newPorps.history.goBack();
      }
    }).catch((err) => {
      console.log('DID NOT WORK');
      if (submitType === 'login') {
        this.setState({ errorMessage: 'The username and/or password is invalid.' });
      } else if (submitType === 'signup') {
        this.setState({ errorMessage: 'The username and/or email address is already in use.' });
      }
    })
  }

  render() {

    console.log('PASSED PROPS', this.props.newProps);

    let otherOption = this.props.userAuthType === 'Login' ?
      <p>
        <span>Need an account?</span>
        <span className="span-link" onClick={this.changeForm}>Sign Up</span>
      </p>
      :
      <p>
        <span>Already have an account?</span>
        <span className="span-link" onClick={this.changeForm}>Login</span>
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
        <span id="exit-button" onClick={this.exitForm}><i className="fa fa-times" aria-hidden="true"></i></span>
        <form className="form">
          {form}
          <div className={this.state.errorMessage ? "error-message" : "no-errors"}>
            {this.state.errorMessage}
          </div>
          <div className="form-footer">
            <button onClick={(evt) => {
              this.submitForm(evt, this.props.userInfo);
            }
            }>{this.props.userAuthType}</button>
            {otherOption}
          </div>
        </form>
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    attemptedLogin: state.attemptedLogin,
    authorize: state.authorized,
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

    clearUserInfo: (username) => {
      const action = { type: 'USER_AUTH_FORM_SUBMIT', username };
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
