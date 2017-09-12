import React, { Component } from 'react';

import Navbar from './Navbar';
import Footer from './Footer';

class BaseLayout extends Component {
  render() {
    return (
      <div className="BaseLayout">
        <Navbar />
        <div className="children">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default BaseLayout;
