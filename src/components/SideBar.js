import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class SideBar extends Component {
  render() {
    return (
      <div className="SideBar">
        {this.props.links.map((link, index) => {
          return (
            <Link key={index} className="sidebar-link" to={link.path}>
              {link.title}
            </Link>
          )
        })}
      </div>
    )
  }
}

export default SideBar;
