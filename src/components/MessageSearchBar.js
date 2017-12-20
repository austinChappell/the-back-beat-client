import React, { Component } from 'react';
import { connect } from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class MessageSearchBar extends Component {

  state = {
    searchBarValue: ''
  }

  handleChangeAndFetch = (evt) => {
    const url = this.props.apiURL;
    const val = evt.target.value;
    this.setState({ searchBarValue: evt.target.value }, () => {
      setTimeout(() => {
        if (val === this.state.searchBarValue && val.length > 0) {
          fetch(`${url}/api/searchusernames/${val}?token=${localStorage.token}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          }).then((response) => {
            return response.json();
          }).then((results) => {
            this.props.handleInputChange(val, results.rows);
          })
        } else if (val.length === 0) {
          this.props.handleInputChange(val, [])
        }
      }, 300);
    })
  }

  setRecipient = (user) => {
    this.setState({ searchBarValue: '' }, () => {
      this.props.setCurrentRecipient(user);
    });
  }

  render() {
    return (
      <div className="MessageSearchBar">
        <input placeholder="Search Name" value={this.state.searchBarValue} onChange={(evt) => this.handleChangeAndFetch(evt)} />
        <div className="display-search-results">
          <List>
            {this.props.users.map((user, index) => {

              const randomCache = Math.floor(Math.random() * 1000000);
              const imageSrc = user.profile_image_url;

              return (
                <ListItem
                  key={index}
                  onClick={() => this.setRecipient(user)}                  primaryText={`${user.first_name} ${user.last_name}`}
                  rightAvatar={<Avatar src={imageSrc} />}
                />
              )
            })}
          </List>
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
