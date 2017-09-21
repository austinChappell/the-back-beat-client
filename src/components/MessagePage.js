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

  componentDidMount() {
    this.props.clearCurrentRecipient();
    const url = this.props.apiURL;
    const fetchAllMessages = () => {
      fetch(`${url}/messages/all`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((results) => {
        console.log('ALL MESSAGES', results.rows);
        this.props.setAllMessages(results.rows);
      })
    }
    fetchAllMessages();
    setInterval(() => {
      fetchAllMessages();
    }, 3000);
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
        <MessageSearchBar />
        <MessageDisplay currentRecipient={this.state.currentRecipient} />
        <MessageHistorySideBar />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allMessages: state.allMessages,
    apiURL: state.apiURL,
    messageSearchBarVal: state.messageSearchBarVal,

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearCurrentRecipient: () => {
      const action = { type: 'CLEAR_CURRENT_RECIPIENT' };
      dispatch(action);
    },

    setAllMessages: (allMessages) => {
      const action = { type: 'SET_ALL_MESSAGES', allMessages };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage);
