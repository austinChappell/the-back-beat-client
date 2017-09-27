import React, { Component } from 'react';
import { connect } from 'react-redux';

class Form extends Component {
  render() {
    return (
      <div className="Form">
        <form>
          {this.props.children}
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
