import React, { Component } from 'react';
import { connect } from 'react-redux';

class RightMainPageSideBar extends Component {
  render() {
    return (
      <div className="RightMainPageSideBar">
        Right Side Bar Component
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

export default connect(mapStateToProps, mapDispatchToProps)(RightMainPageSideBar);
