import React, { Component } from 'react';

import { connect } from 'react-redux';

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

    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
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
    fetch(`${apiURL}/api/performers/${status}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      return response.json();
    }).then((results) => {
      const updateState = {};
      updateState[status] = results.rows;
      this.setState(updateState);
    })
  }

  render() {
    return (
      <div className="PerformedWithPage">
        <div className="approved">
          <h1>Musicians You've Shared the Stage With...</h1>
          <List>
          {this.state.approved.map((performer, index) => {
            return (
              <ListItem 
                key={index} 
                className="performer" 
                primaryText={`${performer.first_name} ${performer.last_name}`}
                rightAvatar={<Avatar src={performer.profile_image_url} />}
              />
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

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PerformedWithPage);
