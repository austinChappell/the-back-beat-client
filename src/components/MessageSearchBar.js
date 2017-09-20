import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageSearchBar extends Component {

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

  getMessages = (user) => {
    const url = this.props.apiURL;
    fetch(`${url}/messages/${user.id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('RESULTS', results.rows);
      this.props.setCurrentRecipientAndMessages(user, results.rows);
    })
  }

  render() {
    return (
      <div className="MessageSearchBar">
        Message Search Bar
        <input value={this.props.messageSearchBarVal} onChange={(evt) => this.handleChangeAndFetch(evt)} />
        <div className="display-search-results">
          {this.props.users.map((user, index) => {
            return (
              <div key={index} className="search-result" onClick={() => this.getMessages(user)}>
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
    apiURL: state.apiURL,
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

    setCurrentRecipientAndMessages: (user, messages) => {
      const action = { type: 'SET_CURRENT_RECIPIENT_AND_MESSAGES', user, messages };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageSearchBar);
