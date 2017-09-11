import React, { Component } from 'react';
import { connect } from 'react-redux';

import LeftMainPageSideBar from './LeftMainPageSideBar';
import NewsFeed from './NewsFeed';
import RightMainPageSideBar from './RightMainPageSideBar';

class Main extends Component {
  render() {
    return (
      <div className="Main">
        <LeftMainPageSideBar />
        <NewsFeed />
        <RightMainPageSideBar />
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);
