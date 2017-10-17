import React, { Component } from 'react';

import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

class CTAButton extends Component {
  render() {
    return (
      <div className="CTAButton">
        <RaisedButton
          label="Sign Up"
          secondary={true}
          // onClick={this.props.toggleUserAuthForm}
        />

        {/* <button onClick={this.props.toggleUserAuthForm}>{this.props.text}</button> */}
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
    toggleUserAuthForm: () => {
      const action = { type: 'TOGGLE_USER_AUTH_FORM', userAuthType: 'Sign Up' };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTAButton);
