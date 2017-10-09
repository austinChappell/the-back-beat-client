import React, { Component } from 'react';
import { connect } from 'react-redux';

import LeftMainPageSideBar from './LeftMainPageSideBar';
import NewsFeed from './NewsFeed';
import MainFeed from './MainFeed';

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

  // onboardingRedirect = () => {
  //   if (this.props.onboardingStage <= this.props.onboardingMaxStage) {
  //     this.props.history.push('/onboarding');
  //   }
  // }

  render() {

    console.log('LOGGED IN USER', this.props.loggedInUser);

    return (
      <div className="Main">
        <LeftMainPageSideBar />
        <MainFeed />
        <NewsFeed />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    currentUsername: state.currentUsername,
    currentUser: state.currentUser,
    loggedInUser: state.loggedInUser,
    onboardingStage: state.onboardingStage,
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
