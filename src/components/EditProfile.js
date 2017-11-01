import React, { Component } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

class EditProfile extends Component {

  componentWillMount() {
    this.hydrateUser();
  }

  hydrateUser = () => {
    const userInfo = {
      bio: this.props.loggedInUser.bio,
      email: this.props.loggedInUser.email,
      firstName: this.props.loggedInUser.first_name,
      lastName: this.props.loggedInUser.last_name,
      skillLevel: this.props.loggedInUser.skill_level,
    }
    this.props.hydrateUser(userInfo);
  }

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.toggleDialog}
      />,
      <FlatButton
        label="Update Profile"
        primary={true}
        onClick={(evt) => {
          this.props.updateProfile(evt, this.props.userInfo);
        }}
      />,
    ];

    let bioCounterWarning;

    if (this.props.userInfo.bio) {
      bioCounterWarning = this.props.userInfo.bio.length > 500 ? { color: 'red' } : {};
    }

    return (
      <div className="EditProfile">
        <Dialog
          modal={false}
          actions={actions}
          open={this.props.showDialog}
          onRequestClose={this.exitForm}
        >
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
              multiLine={true}
              rows={1}
              rowsMax={4}
              floatingLabelStyle={bioCounterWarning}
              floatingLabelText={`Bio ( ${this.props.userInfo.bio ? 500 - this.props.userInfo.bio.length : 500} Characters Remaining )`}
              onChange={(evt) => this.props.handleFormInputChange(evt.target.value, 'bio')}
              value={this.props.userInfo.bio}
            />
            <SelectField
              floatingLabelText="Skill Level"
              onChange={this.handleSkillSelect}
              style={{textAlign: 'left'}}
              value={this.props.userInfo.skillLevel}
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
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUser: state.loggedInUser,
    skillLevels: state.skillLevels,
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleFormInputChange: (value, input) => {
      const action = { type: 'HANDLE_FORM_INPUT_CHANGE', input, value }
      dispatch(action);
    },

    hydrateUser: (userInfo) => {
      console.log('USER INFO INSIDE HYDRATE USER FUNC', userInfo);
      const action = { type: 'UPDATE_USER_INFO', userInfo };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
