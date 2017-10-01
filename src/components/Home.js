import React, { Component } from 'react';

import Contact from './Contact';
import CTAButton from './CTAButton';
import Features from './Features';
import Footer from './Footer';
import UserAuthForm from './UserAuthForm';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="landing-page-background">
          <UserAuthForm newProps={this.props} />
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
        <Contact />
        <Footer />
      </div>
    )
  }
}

export default Home;
