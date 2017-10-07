import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


import NewsFeed from './NewsFeed';

class RightMainPageSideBar extends Component {

  render() {
    return (
      <NewsFeed />
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
