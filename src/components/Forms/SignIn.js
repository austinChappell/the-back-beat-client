import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

import Api from '../../data/api/';

const api = new Api();
const { getUserInfo, login } = api;

const propTypes = {
  setUser: PropTypes.func.isRequired,
};

class SignIn extends Component {
  state = {
    loading: false,
    password: '',
    email: '',
    open: true,
  };

  close = () => {
    this.setState({ open: false })
  }

  enterSite = user => {
    console.log('ENTERING THE SITE WITH USER', user);
    // this.props.setUser(user);
    // onSignIn(this.token).then(() => this.props.navigation.navigate('SignedIn'));
  };

  getUser = results => {
    console.log('HAVE USER', results)
    const { user, token } = results;
    this.token = token;
    getUserInfo(user.id, token, this.enterSite);
  };

  handleInputChange = (val, key) => {
    const o = {};
    o[key] = val;
    this.setState(o);
  };

  signIn = () => {
    this.setState({ loading: true }, () => {
      const { email, password } = this.state;
      const credentials = { email: email.toLowerCase(), password };
      login(credentials, this.getUser);
    });
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.close}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={(evt) => {
          this.signIn();
        }}
      />,
    ];

    return (
      <Dialog
        modal={false}
        actions={actions}
        open={this.state.open}
        onRequestClose={this.close}
      >
        <div className="form-inputs">
          <TextField
            floatingLabelText="Email"
            onChange={(evt) => this.handleInputChange(evt.target.value, 'email')}
            // onKeyUp={(evt) => this.handleKeyUp(evt)}
            value={this.state.email}
          />
          <TextField
            floatingLabelText="Password"
            onChange={(evt) => this.handleInputChange(evt.target.value, 'password')}
            // onKeyUp={(evt) => this.handleKeyUp(evt)}
            type="password"
            value={this.state.password}
          />
        </div>
      </Dialog>
      // <View style={styles.container}>
      //   <FadeInView>
      //     <Text style={styles.header}>The Back Beat</Text>
      //     <Text style={styles.subHeader}>Connecting musicians in a digital age.</Text>
      //     <Card>
      //       <FormLabel>Email</FormLabel>
      //       <FormInput
      //         onChangeText={val => this.handleInputChange(val, 'email')}
      //         value={this.state.email}
      //       />
      //       <FormLabel>Password</FormLabel>
      //       <FormInput
      //         secureTextEntry={true}
      //         onChangeText={val => this.handleInputChange(val, 'password')}
      //         value={this.state.password}
      //       />
      //       <Button
      //         backgroundColor={colors.primary}
      //         disabled={this.state.loading}
      //         disabledStyle={{ backgroundColor: colors.primaryDisabled }}
      //         loading={this.state.loading}
      //         color={colors.white}
      //         buttonStyle={styles.button}
      //         title="Sign In"
      //         onPress={this.signIn}
      //       />
      //       <Text style={{ textAlign: 'center' }}>Need an account?</Text>
      //       <Button
      //         backgroundColor={'transparent'}
      //         color={colors.primary}
      //         title="Sign Up"
      //         onPress={() => navigation.navigate('SignUp')}
      //       />
      //     </Card>
      //   </FadeInView>
      // </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => {
      const action = { type: 'SET_USER', user };
      dispatch(action);
    },
  };
};

SignIn.propTypes = propTypes;

export default connect(null, mapDispatchToProps)(SignIn);
