import React, { Component } from 'react';

class Features extends Component {
  render() {
    return (
      <div className="Features" id="features">
        <h1>Features</h1>
        <div className="feature-list">
          <div className="feature">
            <i className="fa fa-search" aria-hidden="true"></i>
            <h2>Find local musicians</h2>
            <p>Search by genre, instrument, or skill level. Form a band on The Back Beat today!</p>
          </div>
          <div className="feature">
            <i className="fa fa-music" aria-hidden="true"></i>
            <h2>Get connected</h2>
            <p>Our "Performed With" feature lets you connect with those you've shared the stage with.</p>
          </div>
          <div className="feature">
            <i className="fa fa-calendar" aria-hidden="true"></i>
            <h2>Share your gigs</h2>
            <p>Keep track of your own gigs or follow other musicians' calendars.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Features;
