import React, { Component } from 'react';
import { connect } from 'react-redux';

import Contact from './Contact';
import CTAButton from './CTAButton';
import Features from './Features';
import Footer from './Footer';
import UserAuthForm from './UserAuthForm';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

class Home extends Component {

  state = {
    open: false
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

  render() {

    console.log('STATE', this.state);

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.handleClose(false)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={() => this.handleClose(true)}
      />,
    ];

    console.log('ENVIRONMENT', process.env);
    return (
      <div className="Home">
        <div className="landing-page-background">
          <UserAuthForm newProps={this.props} />
          <div className="feature-text">
            <h1>The Back Beat</h1>
            <h2>Connecting musicians<br />in a digital age.</h2>
            <CTAButton text="Sign Up" />
            {/* <RaisedButton
              label="Sign Up"
              secondary={true}
              // onClick={this.handleOpen}
            /> */}
          </div>
          <div className="arrow-wrapper">
            <i id="down-arrow" className="fa fa-angle-down" aria-hidden="true"></i>
          </div>
        </div>
        <Features />
        <Contact />
        <Footer />
        <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            floatingLabelText="First Name"
            onChange={(evt) => this.handleChange(evt, 'eventTitle')}
            value={this.state.eventTitle}
          />
          <TextField
            floatingLabelText="Last Name"
            onChange={(evt) => this.handleChange(evt, 'eventTitle')}
            value={this.state.eventTitle}
          />
          <TextField
            floatingLabelText="Email"
            onChange={(evt) => this.handleChange(evt, 'eventTitle')}
            value={this.state.eventTitle}
          />
          <TextField
            floatingLabelText="Username"
            onChange={(evt) => this.handleChange(evt, 'eventTitle')}
            value={this.state.eventTitle}
          />
          <TextField
            floatingLabelText="Password"
            onChange={(evt) => this.handleChange(evt, 'eventTitle')}
            type="password"
            value={this.state.eventTitle}
          />
          <SelectField
            floatingLabelText="Type"
            value={this.state.eventTypeSelected}
            onChange={this.handleSelecteChange}
          >
            <MenuItem value="" primaryText="City..." />
            <MenuItem value="Austin, TX" primaryText="Austin, TX" />
            <MenuItem value="Dallas, TX" primaryText="Dallas, TX" />
          </SelectField>
          <SelectField
            name="skillLevel"
            floatingLabelText="Skill Level"
            onChange={(evt) => this.props.handleFormInputChange(evt, 'skillLevel')}>
            <MenuItem value="" primaryText="Skill Level..." />
            {this.props.skillLevels.map((skillLevel, index) => {
              return <MenuItem key={index} value={skillLevel} primaryText={skillLevel} />
            })}
          </SelectField>


        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    skillLevels: state.skillLevels
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
