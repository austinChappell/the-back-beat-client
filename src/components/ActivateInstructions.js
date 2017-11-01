import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';

class ActivateInstructions extends Component {
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

export default ActivateInstructions;
