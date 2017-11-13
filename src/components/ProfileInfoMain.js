import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';

class ProfileInfoMain extends Component {

  state = {
    availableSkills: [],
    inputValue: '',
    pendingSkills: [],
    showDialog: false,
    showSkills: [],
    userSkills: []
  }

  addPendingSkill = (skill) => {
    const output = this.state.pendingSkills.slice();
    output.push(skill);
    this.setState({ inputValue: '', showSkills: [], pendingSkills: output });
  }

  componentDidMount() {
    this.setUserSkills(this.props.user);
    // this.getSkills();
  }

  closeDialog = () => {
    this.setState({ inputValue: '', showDialog: false });
  }

  deleteSkills = () => {
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/skills`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('results', results.rows);
      this.updateSkills();
    }).catch((err) => {
      console.log('error', err);
    })
  }

  getSkills = () => {
    console.log('getting skills right now================================')
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/skills`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      const availableSkills = results.rows;
      const userSkills = this.state.userSkills;
      const outcome = [];

      availableSkills.forEach((availSkill) => {
        let match = false;
        userSkills.forEach((userSkill) => {
          if (userSkill.skill_id === availSkill.skill_id) {
            match = true;
          }
        })
        if (!match) {
          outcome.push(availSkill);
        }
      })

      this.setState({ availableSkills: outcome });
    }).catch((err) => {
      console.log('error', err);
    })
  }

  handleChange = (evt, key) => {
    const updateState = {};
    updateState[key] = evt.target.value;
    this.setState(updateState, () => {
      this.showSkills();
    });
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    this.deleteSkills();
  }

  removePendingSkill = (evt, skill) => {
    evt.preventDefault();
    const output = this.state.pendingSkills;
    const avail = this.state.availableSkills;
    output.splice(output.indexOf(skill), 1);
    if (avail.indexOf(skill) === -1) {
      avail.push(skill);
    }
    this.setState({ availableSkills: avail, pendingSkills: output });
  }

  setUserSkills = (user) => {
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/skills/show/${user.id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ userSkills: results.rows, pendingSkills: results.rows }, () => {
        this.getSkills();
      });
    }).catch((err) => {
      console.log('error', err);
    })
  }

  showDialog = (type) => {
    this.setState({ showDialog: true });
  }

  showSkills = () => {
    const output = [];
    // CHECK FOR MATCH AND ONLY SHOW IF IT IS NOT ALREADY PENDING
    this.state.availableSkills.forEach((skill) => {
      const lowerCaseSkill = skill.skill.toLowerCase();
      const input = this.state.inputValue.toLowerCase();
      if (lowerCaseSkill.indexOf(input) !== -1 && this.state.pendingSkills.indexOf(skill) === -1) {
        output.push(skill);
      }
    });
    if (this.state.inputValue == false) {
      this.setState({ showSkills: [] });
    } else {
      this.setState({ showSkills: output });
    }
  }

  updateSkills = () => {
    const apiURL = this.props.apiURL;
    this.state.pendingSkills.forEach((skill) => {
      fetch(`${apiURL}/api/skills`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ skill })
      }).then((response) => {
        return response.json();
      }).then((results) => {
        console.log(results);
      }).catch((err) => {
        console.log('error', err);
      })
    })
  }

  render() {

    console.log('STATE', this.state);

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeDialog}
      />,
      <FlatButton
        label="Update"
        primary={true}
        onClick={(evt) => this.handleSubmit(evt)}
      />,
    ];

    let editSkills;
    const user = this.props.user;
    if (user.id === this.props.loggedInUser.id) {
      editSkills = <i
        className="fa fa-pencil-square-o"
        aria-hidden="true"
        onClick={() => this.showDialog('skills2')}
        style={{ marginLeft: '10px' }}
      >
      </i>
    }

    return (
      <div className="ProfileInfoMain">
        <div className="profile-info">
          <h4>{user.city}</h4>
          <h4>{user.skill_level}</h4>
          <h4>Instruments: </h4>
          <div className="user-instruments">
            {this.props.instruments.map((instrument, index) => {
              return <span key={index} id={instrument.instrument_id}>
                <Link to={`/city/${user.city}/instrument/${instrument.id}`}>{instrument.name}</Link>
              </span>
            })}
          </div>
          <h4 style={{ display: 'inline' }}>Skills: </h4>{editSkills}
          <div className="user-skills">
            {this.state.userSkills.map((skill, index) => {
              return (
                <div key={index}>
                  {skill.skill}
                </div>
              )
            })}
          </div>
        </div>

        <Dialog
          modal={false}
          actions={actions}
          open={this.state.showDialog}
          onRequestClose={this.closeDialog}
        >
          <TextField
            id="skills_input"
            floatingLabelText={this.state.addUploadMsg}
            onChange={(evt) => this.handleChange(evt, 'inputValue')}
            value={this.state.inputValue}
          />
          <List>
            {this.state.showSkills.map((skill, index) => {
              return (
                <ListItem
                  key={index}
                  primaryText={skill.skill}
                  onClick={() => {this.addPendingSkill(skill)}}
                />
              )
            })}
          </List>

          <div className="pending-skills">
            {this.state.pendingSkills.map((skill, index) => {
              return (
                <div className="pending-skill" key={index}>
                  <button onClick={(evt) => this.removePendingSkill(evt, skill)}>
                    remove
                  </button>
                  {skill.skill}
                </div>
              )
            })}
          </div>

        </Dialog>

      </div>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addInstrumentsToCurrentUser: (instrumentArray) => {
      const action = { type: 'ADD_INSTRUMENTS_TO_CURRENT_USER', instrumentArray };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfoMain);
