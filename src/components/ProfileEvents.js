import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileEvents extends Component {
  render() {
    return (
      <div className="ProfileEvents">
        Profile Events Component
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEvents);
