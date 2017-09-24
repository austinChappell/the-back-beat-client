import React, { Component } from 'react';
import { connect } from 'react-redux';

import OnboardingForm from './OnboardingForm';

class Onboarding extends Component {

  render() {
    return (
      <div className="Onboarding">
        The Onboarding Component
        <OnboardingForm />
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    onboardingStage: state.onboardingStage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
