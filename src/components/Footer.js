import React, { Component } from 'react';

class Footer extends Component {
  render() {
    const year = new Date().getFullYear();
    return (
      <div className="Footer">
        <p>&copy; { year } Brothers of Groove</p>
      </div>
    )
  }
}

export default Footer;
