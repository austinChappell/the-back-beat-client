import React, { Component } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';

class ActivateInstructions extends Component {

  componentDidMount() {
    this.logout();
  }

  logout = () => {
    setTimeout(() => {
      this.props.logout();
    }, 5000);
  }

  render() {
    return (
      <div className="ActivateInstructions">
        <Dialog
          modal={false}
          open={true}
        >
          <h2 style={{ fontWeight: '500', textAlign: 'center', lineHeight: '1.5em' }}>Please check your email to activate your account.</h2>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    logout: () => {
      const action = { type: 'LOGOUT' };
      dispatch(action);
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivateInstructions);
