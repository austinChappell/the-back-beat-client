import React, { Component } from 'react';
import { connect } from 'react-redux';

import OnboardingForm from './OnboardingForm';

class Onboarding extends Component {

  componentDidUpdate() {

  }

  render() {
    if (this.props.onboardingStage > this.props.onboardingMaxStage) {
      this.props.history.push('/');
    }
    return (
      <div className="Onboarding">
        <OnboardingForm />
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    onboardingStage: state.onboardingStage,
    onboardingMaxStage: state.onboardingMaxStage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
