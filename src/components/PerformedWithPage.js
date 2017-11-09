import React, { Component } from 'react';

import { connect } from 'react-redux';

class PerformedWithPage extends Component {

  state = {
    approved: [],
    pending: []
  }

  componentDidMount() {
    this.getPerformers('approved');
    this.getPerformers('pending');
  }

  approve = (performerid, approved) => {
    if (approved) {
      console.log('approved', performerid);
    } else {
      console.log('rejected', performerid);
    }
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
          {this.state.approved.map((performer, index) => {
            return (
              <div key={index} className="performer">
                <h2>{performer.first_name} {performer.last_name}</h2>
              </div>
            )
          })}
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
                <h2>{performer.first_name} {performer.last_name}</h2>
                {buttons}
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
