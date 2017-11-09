import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { connect } from 'react-redux';

import ReactTooltip from 'react-tooltip';
import SiteSearch from './SiteSearch';

class Navbar extends Component {

  state = {
    numOfUnreadMessages: 0
  }

  componentDidMount() {
    this.fetchMessagesAfterLogin();
    // TODO: Maybe move setUser out to UserAuth component
    // TODO: Store loggedInUser differently. The code immediately after this comment is not storing loggedInUser.
    // if (this.props.authorized) {
    //   this.setUser();
    // }
  }

  fetchMessagesAfterLogin = () => {
    if (this.props.loggedInUser.id && this.props.loggedInUser.is_active) {
      this.getUnreadMessages();
    } else {
      setTimeout(() => {
        this.fetchMessagesAfterLogin();
      }, 1000);
    }
  }

  getUnreadMessages = () => {
    const url = this.props.apiURL;

    const fetchData = () => {

      fetch(`${url}/messages/unread`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((results) => {
        this.setState({ numOfUnreadMessages: results.rows.length });
      })

    }

    fetchData();

    this.stopMsgFetch = setInterval(() => {
      fetchData();
    }, 5000);

  }

  setUser = () => {
    const url = this.props.apiURL;
    fetch(`${url}/myprofile`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      return response.json();
    }).then((results) => {
      // console.log('PROFILE RESULTS', results.rows[0]);
      const loggedInUser = results.rows[0];
      // console.log('LOGGED IN USER', loggedInUser);
      this.props.addLoggedInUser(loggedInUser);
    })
  }

  logout = () => {
    clearInterval(this.stopMsgFetch)
    this.props.logout();
  }

  showNotifications = () => {
    alert('notification');
  }

  render() {

    let leftNavBarItems = this.props.authorized ?
    <div className="left">
      <NavLink className="brand-name" to="/" exact><img src={require("../assets/images/logo.png")} alt="logo" /></NavLink>
      <SiteSearch />
    </div>
    :
    <div className="left">
      <NavLink className="brand-name" to="/" exact><img src={require("../assets/images/logo.png")} alt="logo" /></NavLink>
    </div>

    let rightNavBarItems = this.props.authorized ?
    <div className="right">
      <NavLink to={`/myprofile`} data-tip="Profile">
        <i className="fa fa-user" aria-hidden="true"></i> {this.props.username}
      </NavLink>
      <NavLink to="/" exact data-tip="Home">
        <i className="fa fa-home" aria-hidden="true"></i>
      </NavLink>
      <NavLink to="/calendar" data-tip="Calendar">
        <i className="fa fa-calendar" aria-hidden="true"></i>
      </NavLink>
      <NavLink className="relative-navlink" to="/messages" data-tip="Messages">
        <i className="fa fa-envelope" aria-hidden="true"></i>
        <i className={this.state.numOfUnreadMessages > 0 ? "fa fa-circle" : "fa fa-circle hidden"} aria-hidden="true"></i>
      </NavLink>
      <NavLink to="/performed_with" data-tip="Performers">
        <i className="fa fa-music" aria-hidden="true"></i>
      </NavLink>
      <span onClick={this.logout}>
        <NavLink to="/login">Logout</NavLink>
      </span>
      <ReactTooltip delayShow={100} />
    </div>
    :
    <div className="right">
      <HashLink to="/#features">Features</HashLink>
      <HashLink to="/#contact">Contact</HashLink>
      <span className="button-link" onClick={this.props.toggleUserAuthForm}>Login</span>
    </div>

    return (
      <div className={this.props.authorized ? "Navbar logged-in" : "Navbar logged-out"}>
        {leftNavBarItems}
        {rightNavBarItems}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    authorized: state.authorized,
    loggedInUser: state.loggedInUser,
    showUserAuthForm: state.showUserAuthForm,
    userAuthType: state.userAuthType,
    username: state.currentUsername
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addLoggedInUser: (user) => {
      const action = { type: 'ADD_LOGGED_IN_USER', user };
      dispatch(action);
    },

    toggleUserAuthForm: () => {
      const action = { type: 'TOGGLE_USER_AUTH_FORM', userAuthType: 'Login' };
      dispatch(action);
    },

    logout: () => {
      const action = { type: 'LOGOUT' };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
