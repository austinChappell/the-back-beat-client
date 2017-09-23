import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageSearchBar extends Component {

  state = {
    searchBarActive: false
  }

  stopFetch = () => {
    console.log('STOP FETCH RUNNING');
    this.setState({ searchBarActive: true });
  }

  handleChangeAndFetch = (evt) => {
    const url = this.props.apiURL;
    const val = evt.target.value;
    if (val.length > 0) {
      fetch(`${url}/api/searchusernames/${val}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        console.log('THIS IS THE RESPONSE SECTION');
        return response.json();
      }).then((results) => {
        this.props.handleInputChange(val, results.rows);
      })
    } else {
      this.props.handleInputChange(val, [])
    }
  }

  // filterMessages = (user) => {
  //   let newUser = user;
  //   this.props.setCurrentRecipient(newUser);
  //   this.setState({ searchBarActive: false });
  //   let stopFetch = setInterval(() => {
  //
  //     if (this.state.searchBarActive === true) {
  //       clearInterval(stopFetch);
  //     }
  //
  //     if (this.props.currentRecipient) {
  //
  //       newUser = this.props.currentRecipient;
  //
  //       const filteredMessages = [];
  //       this.props.allMessages.map((message) => {
  //         if (message.sender_id === newUser.id || message.recipient_id === newUser.id) {
  //           filteredMessages.push(message);
  //         }
  //       });
  //       filteredMessages.map((message) => {
  //         if (message.read === false && message.sender_id === newUser.id) {
  //           message.read = true;
  //           fetch(`${this.props.apiURL}/message/${message.message_id}/markasread`, {
  //             credentials: 'include',
  //             headers: {
  //               'Content-Type': 'application/json'
  //             },
  //             method: 'PUT'
  //           })
  //         }
  //       })
  //       this.props.setCurrentMessages(filteredMessages);
  //       // console.log('FILTERED MESSAGES', filteredMessages);
  //
  //     }
  //
  //   }, 100);
  //
  //
  // }
  //
  render() {
    return (
      <div className="MessageSearchBar">
        Message Search Bar
        <input value={this.props.messageSearchBarVal} onFocus={this.props.stopFetch} onChange={(evt) => this.handleChangeAndFetch(evt)} />
        <div className="display-search-results">
          {this.props.users.map((user, index) => {
            return (
              <div key={index} className="search-result" onClick={() => this.props.filterMessages(user)}>
                <h2>{user.first_name} {user.last_name}</h2>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allMessages: state.allMessages,
    apiURL: state.apiURL,
    currentRecipient: state.currentRecipient,
    messageSearchBarVal: state.messageSearchBarVal,
    users: state.users
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (val, users) => {
      const action = { type: 'HANDLE_MESSAGE_SEARCH_VAL_CHANGE', val, users };
      dispatch(action);
    },

    setCurrentRecipient: (user) => {
      const action = { type: 'SET_CURRENT_RECIPIENT', user };
      dispatch(action);
    },

    setCurrentMessages: (messages) => {
      const action = { type: 'SET_CURRENT_MESSAGES', messages };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageSearchBar);
