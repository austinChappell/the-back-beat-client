import React, { Component } from 'react';
import { connect } from 'react-redux';

import BandBox from './BandBox';
import GigBox from './GigBox';
import RehearsalBox from './RehearsalBox';

class LeftMainPageSideBar extends Component {

  render() {
    return (
      <div className="LeftMainPageSideBar">
        <GigBox />
        <RehearsalBox />
        <BandBox />
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

export default connect(mapStateToProps, mapDispatchToProps)(LeftMainPageSideBar);
