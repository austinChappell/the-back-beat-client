import React, { Component } from 'react';

import CTAButton from './CTAButton';
import Features from './Features';
import UserAuthForm from './UserAuthForm';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="landing-page-background">
          <UserAuthForm />
          <div className="feature-text">
            <h1>The Back Beat</h1>
            <h2>Connecting musicians<br />in a digital age.</h2>
            <CTAButton text="Sign Up" />
          </div>
          <div className="arrow-wrapper">
            <i id="down-arrow" className="fa fa-angle-down" aria-hidden="true"></i>
          </div>
        </div>
        <Features />
      </div>
    )
  }
}

export default Home;
