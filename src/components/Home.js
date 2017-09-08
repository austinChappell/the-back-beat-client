import React, { Component } from 'react';

import SignUpForm from './SignUpForm';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="overlay">
          <div className="feature-text">
            <h1>The Back Beat</h1>
            <h2>Connecting musicians<br />in a digital age.</h2>
          </div>
          <SignUpForm />
        </div>
      </div>
    )
  }
}

export default Home;
