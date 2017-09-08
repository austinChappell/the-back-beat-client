import React, { Component } from 'react';

import Navbar from './Navbar';

class BaseLayout extends Component {
  render() {
    return (
      <div className="BaseLayout">
        <Navbar />
        {this.props.children}
      </div>
    )
  }
}

export default BaseLayout;
