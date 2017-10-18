import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

class UserAuthForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      checkUsernameMessage: null,
      checkUsernameLength: null,
      citySelect: null,
      open: false,
    }

    this.stopTimeout = undefined;

  }

  handleChange = (evt, input, checkInputAvailability) => {
    let component = this;
    let value = evt.target.value;
    clearTimeout(this.stopTimeout);
    const inputLength = evt.target.value.length;
    this.props.handleFormInputChange(evt, input);
    this.stopTimeout = setTimeout(function () {
      if (checkInputAvailability) {
        fetch(`${component.props.apiURL}/api/${input}/${value}`).then((response) => {
          return response.json();
        }).then((results) => {
          if (input === 'username') {

            if (inputLength >= 6) {
              component.setState({ checkUsernameLength: null });
            }

            if (results.length > 0) {
              component.setState({ checkUsernameMessage: 'This username is already in use' });
            } else {
              component.setState({ checkUsernameMessage: null });
            }

          }
        })
      }
    }, 1000);
  }

  checkUserNameLength = (evt) => {
    const inputLength = evt.target.value.length;
    if (inputLength < 6) {
      this.setState({ checkUsernameLength: 'Username must be at least 6 characters.' });
    } else {
      this.setState({ checkUsernameLength: null });
    }
  }

  exitForm = () => {
    this.setState({ errorMessage: null, checkUsernameMessage: null, checkUsernameLength: null });
    this.props.toggleUserAuthForm();
  }

  changeForm = () => {
    this.setState({ errorMessage: null, checkUsernameMessage: null, checkUsernameLength: null });
    this.props.toggleUserAuthType();
  }

  getMusicians = (user, styleids) => {

    const skillLevels = this.props.skillLevels;
    const apiURL = this.props.apiURL;
    const userSkillIndex = skillLevels.indexOf(user.skill_level);
    let skill_level_one = skillLevels[userSkillIndex - 1];
    let skill_level_two = skillLevels[userSkillIndex];
    let skill_level_three = skillLevels[userSkillIndex + 1];
    let styleidone = styleids[0];
    let styleidtwo = styleids[1];
    let styleidthree = styleids[2];

    if (userSkillIndex === 0) {

      skill_level_one = 'no_skill';
    }

    if (userSkillIndex === skillLevels.length - 1) {
      skill_level_three = 'no_skill';
    }

    const url = `${apiURL}/api/users/styleidone/${styleidone}/styleidtwo/${styleidtwo}/styleidthree/${styleidthree}/city/${user.city}/skill_level_one/${skill_level_one}/skill_level_two/${skill_level_two}/skill_level_three/${skill_level_three}`;

    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {

      function randomize (arr) {
        const newArray = [];

        while (arr.length > 0) {
          let randomNum = Math.random() * arr.length;
          let item = arr.splice(randomNum, 1);
          newArray.push(item[0]);
        }

        return newArray;
      }

      let randomResults = randomize(results.rows);
      let limitedResults = randomResults.splice(0, 25);

      this.props.getMusicians(limitedResults);
    });

  }

  getUserStyles = (loggedInUser) => {
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/user/styles`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      const styles = [];
      results.rows.forEach((style) => {
        styles.push(style.style_id);
      });
      console.log('STYLES', styles);
      this.getMusicians(loggedInUser, styles);
    })
  }

  setUser = () => {
    console.log('SET USER FIRING');
    const url = this.props.apiURL;
    fetch(`${url}/myprofile`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      console.log('SET USER RESPONSE', response);
      return response.json();
    }).then((results) => {
      // console.log('PROFILE RESULTS', results.rows[0]);
      const loggedInUser = results.rows[0];
      console.log('SET USER LOGGED IN USER', loggedInUser);
      // console.log('LOGGED IN USER', loggedInUser);
      this.getUserStyles(loggedInUser);
      this.props.addLoggedInUser(loggedInUser);
      return loggedInUser;
    })
  }

  submitForm = (evt, userInfo) => {
    evt.preventDefault();
    const submitType = this.props.userAuthType === 'Login' ? 'login' : 'signup';
    fetch(`${this.props.apiURL}/${submitType}/`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(userInfo)
    }).then((response) => {
      return response.json();
    }).then((results) => {
      const data = results;
      this.props.clearUserInfo(userInfo.username);
      this.setUser();

      //
      // if (this.props.onboardingStage === 0) {
      //   this.props.newProps.history.push('/onboarding');
      // } else if (this.props.onboardingStage === 1) {
      //   this.props.newProps.history.push('/');
      // } else {
      //   this.props.newProps.history.goBack();
      // }


      if (submitType === 'login') {
        this.props.newProps.history.push('/');
      } else if (submitType === 'signup') {
        this.props.newProps.history.push('/onboarding');
        // this.props.newProps.history.push(`/profile/${userInfo.username}`);
      } else {
        this.props.newProps.history.goBack();
      }


    }).catch((err) => {
      console.log('FETCH FAILED');
      if (submitType === 'login') {
        this.setState({ errorMessage: 'The username and/or password is invalid.' });
      } else if (submitType === 'signup') {
        this.setState({ errorMessage: 'There is already an account associated with this email address.' });
      }
    })
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = (submit) => {
    this.setState({open: false});
    if (submit) {
      console.log('true');
    } else {
      console.log('false');
    }
  };

  handleCitySelect = (evt, index, value) => {
    this.setState({citySelect: value}, () => {
      this.props.handleInputChange(value, 'city')
    })
  }

  handleSkillSelect = (evt, index, value) => {
    this.setState({skillSelect: value}, () => {
      this.props.handleInputChange(value, 'skill')
    })
  }

  render() {

    console.log('STATE', this.state);

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.exitForm}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={(evt) => {
          console.log('button clicked');
          this.submitForm(evt, this.props.userInfo);
        }}
      />,
    ];

    // console.log('render user auth page');

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
        <TextField
          floatingLabelText="Username"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'username')}
          value={this.props.userInfo.username}
        />
        {/* <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'username')}
          value={this.props.userInfo.username} /> */}
        <TextField
          floatingLabelText="Password"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'password')}
          type="password"
          value={this.props.userInfo.password}
        />
        {/* <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'password')}
          value={this.props.userInfo.password} /> */}
      </div>
      :
      <div className="form-inputs">
        <TextField
          floatingLabelText="First Name"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'firstName')}
          value={this.props.userInfo.firstName}
        />
        {/* <input
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'firstName')}
          value={this.props.userInfo.firstName} /> */}
          <TextField
            floatingLabelText="Last Name"
            onChange={(evt) => this.props.handleFormInputChange(evt, 'lastName')}
            value={this.props.userInfo.lastName}
          />
        {/* <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'lastName')}
          value={this.props.userInfo.lastName} /> */}
          <TextField
            floatingLabelText="Email"
            onChange={(evt) => this.props.handleFormInputChange(evt, 'email')}
            value={this.props.userInfo.email}
          />
        {/* <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'email')}
          value={this.props.userInfo.email} /> */}
          <TextField
            floatingLabelText="Username"
            onChange={(evt) => this.handleChange(evt, 'username', true)}
            onBlur={(evt) => this.checkUserNameLength(evt)}
            value={this.props.userInfo.username}
          />
        {/* <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(evt) => this.handleChange(evt, 'username', true)}
          onBlur={(evt) => this.checkUserNameLength(evt)}
          value={this.props.userInfo.username} /> */}
          <TextField
            floatingLabelText="Password"
            onChange={(evt) => this.props.handleFormInputChange(evt, 'password')}
            type="password"
            value={this.props.userInfo.password}
          />
        {/* <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(evt) => this.props.handleFormInputChange(evt, 'password')}
          value={this.props.userInfo.password} /> */}
        <SelectField
          floatingLabelText="City"
          onChange={this.handleCitySelect}
          value={this.state.citySelect}
        >
          <MenuItem value="Austin, TX" primaryText="Austin, TX" />
          <MenuItem value="Dallas, TX" primaryText="Dallas, TX" />
        </SelectField>
        <SelectField
          floatingLabelText="Skill Level"
          onChange={this.handleSkillSelect}
          value={this.state.skillSelect}
        >
          {this.props.skillLevels.map((skillLevel, index) => {
            return (
              <MenuItem
                key={index}
                value={skillLevel}
                primaryText={skillLevel}
              />
            )
          })}
        </SelectField>
      </div>


    return (

      <div className={this.props.showUserAuthForm ? "UserAuthForm" : "hide"}>
        {/* <span id="exit-button" onClick={this.exitForm}><i className="fa fa-times" aria-hidden="true"></i></span> */}
        <Dialog
          // title="Dialog With Actions"
          modal={false}
          actions={actions}
          open={this.props.showUserAuthForm}
          onRequestClose={this.exitForm}
        >
        {/* <form className="form"> */}
          {form}
          <div className={this.state.checkUsernameLength ? "error-message" : "no-errors"}>
            {this.state.checkUsernameLength}
          </div>
          <div className={this.state.checkUsernameMessage ? "error-message" : "no-errors"}>
            {this.state.checkUsernameMessage}
          </div>
          <div className={this.state.errorMessage ? "error-message" : "no-errors"}>
            {this.state.errorMessage}
          </div>
          <div className="form-footer">
            {/* <RaisedButton
              label={this.props.userAuthType}
              secondary={true}
              onClick={(evt) => {
                console.log('button clicked');
                this.submitForm(evt, this.props.userInfo);
              }}
            /> */}

            {/* <button onClick={(evt) => {
              console.log('button clicked');
              this.submitForm(evt, this.props.userInfo);
            }
            }>{this.props.userAuthType}</button> */}
            {otherOption}
          </div>
        </Dialog>
        {/* </form> */}
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    attemptedLogin: state.attemptedLogin,
    authorize: state.authorized,
    onboardingStage: state.onboardingStage,
    showUserAuthForm: state.showUserAuthForm,
    skillLevels: state.skillLevels,
    userAuthType: state.userAuthType,
    userInfo: state.userInfo,
    userStyleIds: state.userStyleIds
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    addLoggedInUser: (user) => {
      console.log('ADD LOGGED IN USER FUNCTION RUNNING', user);
      const action = { type: 'ADD_LOGGED_IN_USER', user };
      dispatch(action);
    },

    handleFormInputChange: (evt, input) => {
      const action = { type: 'HANDLE_FORM_INPUT_CHANGE', input, value: evt.target.value }
      dispatch(action);
    },

    clearUserInfo: (username) => {
      console.log('CLEAR USER INFO FIRING');
      const action = { type: 'USER_AUTH_FORM_SUBMIT', username };
      dispatch(action);
    },

    getMusicians: (data) => {
      const action = { type: 'GET_COMPATIBLE_MUSICIANS', data };
      dispatch(action);
    },

    setStyles: (styles) => {
      const action = { type: 'SET_USER_STYLE_IDS', styles };
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
