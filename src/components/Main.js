import React, { Component } from 'react';
import { connect } from 'react-redux';

import LeftMainPageSideBar from './LeftMainPageSideBar';
import NewsFeed from './NewsFeed';
import RightMainPageSideBar from './RightMainPageSideBar';

class Main extends Component {

  componentDidMount() {
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/profile/${this.props.currentUsername}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.updateUser(results);
      window.localStorage.username = results.username;
      this.props.setOnboardingStage(results.onboarding_stage);
    })
  }

  componentDidUpdate() {
    if (this.props.onboardingStage <= this.props.onboardingMaxStage) {
      this.props.history.push('/onboarding');
    }
  }

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
    apiURL: state.apiURL,
    currentUsername: state.currentUsername,
    currentUser: state.currentUser,
    onboardingStage: state.loggedInUser.onboarding_stage,
    onboardingMaxStage: state.onboardingMaxStage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setOnboardingStage: (stage) => {
      const action = { type: 'SET_ONBOARDING_STAGE', stage };
      dispatch(action);
    },

    updateUser: (results) => {
      const action = { type: 'UPDATE_USER', user: results };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
