import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import Navbar from './Navbar';
import Footer from './Footer';

class BaseLayout extends Component {
  render() {
    return (
      <div className="BaseLayout">
        {/* <AppBar
          title="backBeat"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        /> */}
        <Navbar />
        <div className="children">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default BaseLayout;
