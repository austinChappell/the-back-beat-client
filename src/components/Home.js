import React, { Component } from 'react';

import Features from './Features';
import SignUpForm from './SignUpForm';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="landing-page-background">
          <div className="feature-text">
            <h1>The Back Beat</h1>
            <h2>Connecting musicians<br />in a digital age.</h2>
          </div>
          <SignUpForm />
        </div>
        <Features />
      </div>
    )
  }
}

export default Home;
