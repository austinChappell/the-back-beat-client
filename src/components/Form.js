import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

class Form extends Component {
  render() {
    return (
      <div className="Form">
        <form>
          {this.props.children}
          <RaisedButton
            label={this.props.submitBtnText}
            primary={true}
            onClick={(evt) => this.props.onSubmit(evt)}
          />
        </form>
      </div>
    )
  }
}

export default Form;
