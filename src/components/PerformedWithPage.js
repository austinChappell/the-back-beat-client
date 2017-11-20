import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';

class PerformedWithPage extends Component {

  state = {
    approved: [],
    pending: []
  }

  componentDidMount() {
    this.fillPerformerList();
  }

  approve = (performerid, approved) => {
    const apiURL = this.props.apiURL;
    let url;
    let method;
    if (approved) {
      url = `${apiURL}/api/performers/approve`;
      method = 'PUT';
    } else {
      url = `${apiURL}/api/performers/reject`;
      method = 'DELETE';
    }

    fetch(`${url}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method,
      body: JSON.stringify({
        performerid
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.fillPerformerList();
    }).catch((err) => {
      console.log('error', err);
    })
  }

  fillPerformerList = () => {
    this.getPerformers('approved');
    this.getPerformers('pending');
  }

  getPerformers = (status) => {
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/performers/${status}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
    }).then((response) => {
      return response.json();
    }).then((results) => {
      const updateState = {};
      updateState[status] = results.rows;
      this.setState(updateState);
    })
  }

  removePerformer = (performerid) => {
    console.log('removing performer', performerid)
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/performers/remove/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'DELETE',
      body: JSON.stringify({
        performerid
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log(results);
    }).catch((err) => {
      console.log('error', err);
    })
  }

  updateUser = (user) => {
    this.props.updateUser(user);
  }

  render() {
    return (
      <div className="PerformedWithPage">
        <div className="approved">
          <h1>Musicians You've Shared the Stage With...</h1>
          <List>
          {this.state.approved.map((performer, index) => {
            return (
              <Link
                onClick={() => this.updateUser(performer)}
                to={`/profile/${performer.username}`}
              >
                <i
                  className="reject fa fa-times-circle"
                  onClick={() => this.removePerformer(performer.id)}
                >
                </i>
                <ListItem
                  key={index}
                  className="performer"
                  primaryText={`${performer.first_name} ${performer.last_name}`}
                  rightAvatar={<Avatar src={performer.profile_image_url} />}
                />
              </Link>
            )
          })}
          </List>
        </div>
        <div className="pending">
          <h1>Requests</h1>
          {this.state.pending.map((performer, index) => {
            let buttons = null;

            if (performer.performer_2_id === this.props.loggedInUser.id) {
              buttons = <div>
                <i
                  className="accept fa fa-check-circle"
                  onClick={() => this.approve(performer.id, true)}
                >
                </i>
                <i
                  className="reject fa fa-times-circle"
                  onClick={() => this.approve(performer.id, false)}
                >
                </i>
              </div>
            }

            return (
              <div key={index} className="performer">
                {buttons}
                <ListItem
                  key={index}
                  className="performer"
                  primaryText={`${performer.first_name} ${performer.last_name}`}
                  rightAvatar={<Avatar src={performer.profile_image_url} />}
                />
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
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => {
      const action = { type: 'UPDATE_USER', user };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PerformedWithPage);
