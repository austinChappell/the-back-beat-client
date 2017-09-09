import React, { Component } from 'react';

import Navbar from './Navbar';
import Footer from './Footer';

class BaseLayout extends Component {
  render() {
    return (
      <div className="BaseLayout">
        <Navbar />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

export default BaseLayout;
