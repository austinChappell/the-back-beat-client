import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ActionGrade from 'material-ui/svg-icons/action/grade';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';

class ProfileConnections extends Component {

  state = {
    performers: []
  }

  componentDidMount() {
    const userPerformers = this.props.userPerformers;
    const sharedPerformers = this.props.sharedPerformers;
    const loggedInUserId = this.props.loggedInUser.id;
    // if (userPerformers.indexOf(loggedInUserId) == -1) {
    //   this.getPerformerInfo(sharedPerformers);
    // } else {
      this.getPerformerInfo(userPerformers);
    // }
  }

  getPerformerInfo = (performers) => {
    const output = [];
    performers.forEach((performer) => {
      if (performer !== this.props.loggedInUser.id) {
        const apiURL = this.props.apiURL;
        fetch(`${apiURL}/api/user/${performer}?&token=${localStorage.token}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',

          }
        }).then((response) => {
          return response.json();
        }).then((user) => {
          output.push(user);
          this.setState({ performers: output });
        }).catch((err) => {
          console.log('error', err);
        })
      }
    })
  }

  updateUser = (user) => {
    this.props.updateUser(user);
  }

  render() {
    return (
      <div className="ProfileConnections">
        <List>
          {this.state.performers.map((performer, index) => {
            const sharedPerformers = this.props.sharedPerformers;
            const leftIcon = sharedPerformers.indexOf(performer.id) !== -1 ? <ActionGrade color={'#894586'} /> : null;
            return (
              <Link
                onClick={() => this.updateUser(performer)}
                to={`/profile/${performer.username}`}
              >
                <ListItem
                  className="performer"
                  key={index}
                  leftIcon={leftIcon}
                  insetChildren={true}
                  primaryText={`${performer.first_name} ${performer.last_name}`}
                  rightAvatar={<Avatar src={performer.profile_image_url} />}
                />
              </Link>
            )
          })}
        </List>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileConnections);
