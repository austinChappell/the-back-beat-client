import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class SideBar extends Component {
  render() {
    return (
      <div className="SideBar" onClick={this.props.onClick}>
        {this.props.links.map((link, index) => {
          const linkClassName = link.path === this.props.url ? "sidebar-link active" : "sidebar-link";
          return (
            <Link key={index} className={linkClassName} to={link.path}>
              {link.title}
            </Link>
          )
        })}
      </div>
    )
  }
}

export default SideBar;
