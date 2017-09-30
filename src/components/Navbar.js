import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { connect } from 'react-redux';

class Navbar extends Component {

  state = {
    numOfUnreadMessages: 0
  }

  componentDidMount() {
    this.getUnreadMessages();
    // TODO: Maybe move setUser out to UserAuth component
    // TODO: Store loggedInUser differently. The code immediately after this comment is not storing loggedInUser.
    if (this.props.authorized) {
      this.setUser();
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
        console.log('UNREAD MESSAGES', results.rows);
        this.setState({ numOfUnreadMessages: results.rows.length });
      })

    }

    fetchData();

    setInterval(() => {
      console.log('FETCH DATA');
      fetchData();
    }, 25000);

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

  render() {

    let rightNavBarItems = this.props.authorized ?
    <div className="right">
      <NavLink to={`/myprofile`}>
        <i className="fa fa-user" aria-hidden="true"></i> {this.props.username}
      </NavLink>
      <NavLink to="/" exact>
        <i className="fa fa-newspaper-o" aria-hidden="true"></i>
      </NavLink>
      <NavLink className="relative-navlink" to="/band/create">
        <i className="fa fa-music" aria-hidden="true"></i>
        <i className="fa fa-plus" aria-hidden="true"></i>
      </NavLink>
      <NavLink className="relative-navlink" to="/calendar">
        <i className="fa fa-calendar" aria-hidden="true"></i>
        <i className="fa fa-plus" aria-hidden="true"></i>
      </NavLink>
      <NavLink to="/connect">
        <i className="fa fa-users" aria-hidden="true"></i>
      </NavLink>
      <NavLink className="relative-navlink" to="/messages">
        <i className="fa fa-envelope" aria-hidden="true"></i>
        <i className={this.state.numOfUnreadMessages > 0 ? "fa fa-circle" : "fa fa-circle hidden"} aria-hidden="true"></i>
      </NavLink>
      <span onClick={this.props.logout}><NavLink to="/login">Logout</NavLink></span>
    </div>
    :
    <div className="right">
      <HashLink to="/#features">Features</HashLink>
      <HashLink to="/#contact">Contact</HashLink>
      <span className="button-link" onClick={this.props.toggleUserAuthForm}>Login</span>
    </div>

    return (
      <div className={this.props.authorized ? "Navbar logged-in" : "Navbar logged-out"}>
        <div className="left">
          <NavLink className="brand-name" to="/" exact><img src={require("../assets/images/logo.png")} alt="logo" /></NavLink>
        </div>
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
      // console.log('ADD LOGGED IN USER FUNCTION RUNNING');
      const action = { type: 'ADD_LOGGED_IN_USER', user };
      dispatch(action);
    },

    toggleUserAuthForm: () => {
      const action = { type: 'TOGGLE_USER_AUTH_FORM', userAuthType: 'Login' };
      dispatch(action);
    },

    logout: () => {
      console.log('HELLO FROM THE DISPATCH');
      const action = { type: 'LOGOUT' };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
