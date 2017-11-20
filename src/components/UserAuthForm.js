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

  }

  handleChange = (evt, input, checkInputAvailability) => {
    let component = this;
    let value = evt.target.value;
    clearTimeout(this.stopTimeout);
    const inputLength = evt.target.value.length;
    this.props.handleFormInputChange(evt.target.value, input);
    this.stopTimeout = setTimeout(function () {
      if (checkInputAvailability && value.length > 0) {
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
      } else if (value.length === 0) {
        component.setState({ checkUsernameMessage: null });
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

    fetch(`${url}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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

  setDefaultPhoto = () => {
    console.log('DELETE PHOTO FUNCTION RUNNING');
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/uploaddefault/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }).then(() => {
      this.setState({ profilePicture: false, croppedImg: null });
    }).catch((err) => {
      console.log(err);
    })
  }

  getUserStyles = (loggedInUser) => {
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/user/styles/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      const styles = [];
      results.rows.forEach((style) => {
        styles.push(style.style_id);
      });
      this.getMusicians(loggedInUser, styles);
    })
  }

  setUser = (submitType) => {
    const url = this.props.apiURL;
    console.log('about to set user');
    const userid = localStorage.getItem('userid');
    fetch(`${url}/myprofile/${userid}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log('response', response);
      return response.json();
    }).then((results) => {
      console.log('results', results);
      const loggedInUser = results.rows[0];
      console.log('LOGGED IN USER', loggedInUser);
      this.getUserStyles(loggedInUser);
      this.props.addLoggedInUser(loggedInUser);
      const active = loggedInUser.is_active;

      if (active !== true) {
        this.props.newProps.history.push('/activate_instructions');
      } else if (submitType === 'login') {
        this.props.newProps.history.push('/');
      } else if (submitType === 'signup') {
        this.setDefaultPhoto();
        this.props.newProps.history.push('/onboarding');
        // this.props.newProps.history.push(`/profile/${userInfo.username}`);
      } else {
        this.props.newProps.history.goBack();
      }

    }).catch((err) => {
      console.log('error', err);
    })
  }

  submitForm = (evt, userInfo) => {
    evt.preventDefault();
    const activation_key = Math.floor(Math.random() * 1000000000);
    console.log('USER INFO', userInfo);
    const submitType = this.props.userAuthType === 'Login' ? 'login' : 'signup';
    if (submitType === 'signup') {
      userInfo.activation_key = activation_key;
    }
    fetch(`${this.props.apiURL}/${submitType}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(userInfo)
    }).then((response) => {
      return response.json();
    }).then((results) => {
      const data = results;
      console.log('data', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userid', data.userid);
      this.props.setAuthToken(data.token);
      this.props.clearUserInfo(userInfo.username);
      this.setUser(submitType);

      if (submitType === 'signup') {
        // TODO: Store and auth token upon sign up
        fetch(`${this.props.apiURL}/uploaddefault`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST'
        }).catch((err) => {
          console.log(err);
        })
      }

      // if (submitType === 'login') {
      //   this.props.newProps.history.push('/');
      // } else if (submitType === 'signup') {
      //   this.setDefaultPhoto();
      //   this.props.newProps.history.push('/onboarding');
      //   // this.props.newProps.history.push(`/profile/${userInfo.username}`);
      // } else {
      //   this.props.newProps.history.goBack();
      // }

    }).catch((err) => {
      if (submitType === 'login') {
        this.setState({ errorMessage: 'The username and/or password is invalid.' });
      } else if (submitType === 'signup') {
        this.setState({ errorMessage: 'There is already an account associated with this email address.' });
      }
    })
  }

  handleCitySelect = (evt, index, value) => {
    this.setState({citySelect: value}, () => {
      this.props.handleFormInputChange(value, 'city')
    })
  }

  handleSkillSelect = (evt, index, value) => {
    this.setState({skillSelect: value}, () => {
      this.props.handleFormInputChange(value, 'skillLevel')
    })
  }

  render() {

    const errorMessageStyle = {
      color: '$color-failure',
      border: '1px solid $color-failure',
      borderRadius: '2px',
      backgroundColor: 'pink',
      padding: '10px',
      textAlign: 'center',
      marginTop: '20px',
      fontWeight: '100',
      transition: '400ms'
    }

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
          this.submitForm(evt, this.props.userInfo);
        }}
      />,
    ];

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

    let bioCounterWarning;

    if (this.props.userInfo.bio) {
      bioCounterWarning = this.props.userInfo.bio.length > 500 ? { color: 'red' } : {};
    }

    let form = this.props.userAuthType === 'Login' ?
      <div className="form-inputs">
        <TextField
          floatingLabelText="Username"
          onChange={(evt) => this.props.handleFormInputChange(evt.target.value, 'username')}
          value={this.props.userInfo.username}
        />
        <TextField
          floatingLabelText="Password"
          onChange={(evt) => this.props.handleFormInputChange(evt.target.value, 'password')}
          type="password"
          value={this.props.userInfo.password}
        />
      </div>
      :
      <div className="form-inputs">
        <TextField
          floatingLabelText="First Name"
          onChange={(evt) => this.props.handleFormInputChange(evt.target.value, 'firstName')}
          value={this.props.userInfo.firstName}
        />
        <TextField
          floatingLabelText="Last Name"
          onChange={(evt) => this.props.handleFormInputChange(evt.target.value, 'lastName')}
          value={this.props.userInfo.lastName}
        />
        <TextField
          floatingLabelText="Email"
          onChange={(evt) => this.props.handleFormInputChange(evt.target.value, 'email')}
          value={this.props.userInfo.email}
        />
        <TextField
          floatingLabelText="Username"
          onChange={(evt) => this.handleChange(evt, 'username', true)}
          onBlur={(evt) => this.checkUserNameLength(evt)}
          value={this.props.userInfo.username}
        />
        <TextField
          floatingLabelText="Password"
          onChange={(evt) => this.props.handleFormInputChange(evt.target.value, 'password')}
          type="password"
          value={this.props.userInfo.password}
        />
        <TextField
          multiLine={true}
          rows={1}
          rowsMax={4}
          floatingLabelStyle={bioCounterWarning}
          floatingLabelText={`Bio ( ${this.props.userInfo.bio ? 500 - this.props.userInfo.bio.length : 500} Characters Remaining )`}
          onChange={(evt) => this.props.handleFormInputChange(evt.target.value, 'bio')}
          value={this.props.userInfo.bio}
        />
        <SelectField
          floatingLabelText="City"
          onChange={this.handleCitySelect}
          style={{textAlign: 'left'}}
          value={this.state.citySelect}
        >
          <MenuItem value="Austin, TX" primaryText="Austin, TX" />
          <MenuItem value="Dallas, TX" primaryText="Dallas, TX" />
        </SelectField>
        <SelectField
          floatingLabelText="Skill Level"
          onChange={this.handleSkillSelect}
          style={{textAlign: 'left'}}
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
        <Dialog
          modal={false}
          actions={actions}
          open={this.props.showUserAuthForm}
          onRequestClose={this.exitForm}
        >
          {form}
          <div className={this.state.checkUsernameLength ? "error-message" : "no-errors"}>
            {this.state.checkUsernameLength}
          </div>
          <div className={this.state.checkUsernameMessage ? "error-message" : "no-errors"}>
            {this.state.checkUsernameMessage}
          </div>
          <div style={this.state.errorMessage ? errorMessageStyle : {}}>
            {this.state.errorMessage}
          </div>
          <div className="form-footer">
            {otherOption}
          </div>
        </Dialog>
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    authToken: state.authToken,
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
      const action = { type: 'ADD_LOGGED_IN_USER', user };
      dispatch(action);
    },

    handleFormInputChange: (value, input) => {
      const action = { type: 'HANDLE_FORM_INPUT_CHANGE', input, value }
      dispatch(action);
    },

    clearUserInfo: (username) => {
      const action = { type: 'USER_AUTH_FORM_SUBMIT', username };
      dispatch(action);
    },

    getMusicians: (data) => {
      const action = { type: 'GET_COMPATIBLE_MUSICIANS', data };
      dispatch(action);
    },

    setAuthToken: (token) => {
      const action = { type: 'SET_AUTH_TOKEN', token };
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
