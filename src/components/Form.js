import React, { Component } from 'react';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';

class Form extends Component {
  render() {
    return (
      <div className="Form">
        <form>
          {this.props.children}
          {/* <button onClick={(evt) => this.props.onSubmit(evt)}>{this.props.submitBtnText}</button> */}
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

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
