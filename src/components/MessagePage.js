import React, { Component } from 'react';
import { connect } from 'react-redux';

import MessageDisplay from './MessageDisplay';
import MessageHistorySideBar from './MessageHistorySideBar';
import MessageSearchBar from './MessageSearchBar';

class MessagePage extends Component {

  state = {
    currentRecipient: {},
    searchValue: '',
    users: []
  }

  fetchUsers = () => {
    const url = this.props.apiURL;
    const val = this.state.searchValue;
    fetch(`${url}/api/searchusernames/${val}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log('THIS IS THE RESPONSE SECTION');
      return response.json();
    }).then((results) => {
      this.setState({ users: results.rows });
    })
  }

  handleChange = (evt) => {
    console.log('changed', evt.target.value);
    if (evt.target.value.length === 0) {
      this.setState({
        users: [],
        searchValue: ''
      })
    } else {
      this.setState({ searchValue: evt.target.value }, () => {
        this.fetchUsers();
      });
    }
  }

  setCurrentRecipient = (user) => {
    console.log('USER', user);
  }

  render() {
    return (
      <div className="MessagePage">
        {/* TODO this needs to go to redux instead, including these child components */}
        <MessageSearchBar />
        <MessageDisplay currentRecipient={this.state.currentRecipient} />
        <MessageHistorySideBar />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    messageSearchBarVal: state.messageSearchBarVal,

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (evt) => {
    }
  }
}

export default connect(mapStateToProps)(MessagePage);
