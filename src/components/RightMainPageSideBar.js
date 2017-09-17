import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserBox from './UserBox';

class RightMainPageSideBar extends Component {
  render() {
    return (
      <div className="RightMainPageSideBar">
        <UserBox />
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
