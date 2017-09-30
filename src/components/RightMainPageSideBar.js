import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import BrowseBox from './BrowseBox';
import UserBox from './UserBox';

class RightMainPageSideBar extends Component {

  state = {
    eventIndex: 0,
    eventIndexRange: [0, 1],
    musician: {
      name: '',
      url: '',
      city: '',
      skillLevel: '',
      instruments: []
    },
    musicianIndex: 0,
    musicianIndexRange: [0, 1],
    musicians: []
  }

  componentDidMount() {
    const apiURL = this.props.apiURL;
    // const url = 'http://localhost:6001/api/users';
    fetch(`${apiURL}/api/users`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      const currentMusician = data[0];
      currentMusician.name = `${currentMusician.first_name} ${currentMusician.last_name}`;
      currentMusician.url = `/profile/${currentMusician.username}`;
      this.setState({ musicians: data, musician: currentMusician });
    });
  }

  swipe = (itemsArray, itemIndexName, direction) => {
    console.log('SWIPE FUNCTION', direction);
    const updateObj = {};
    if (this.state[itemIndexName] === this.state[itemsArray].length - 1 && direction === 1) {
      updateObj[itemIndexName] = 0;
    } else if (this.state[itemIndexName] === 0 && direction === -1) {
      updateObj[itemIndexName] = this.state[itemsArray].length - 1;
    } else {
      updateObj[itemIndexName] = this.state[itemIndexName] + direction;
    }
    this.setState(updateObj);
  }

  render() {

    let musician = {};
    if (this.state.musicians.length > 0) {
      musician = this.state.musicians[this.state.musicianIndex];
    }

    console.log('MUSICIAN', musician);

    return (
      <div className="RightMainPageSideBar">

        <UserBox />

        <BrowseBox
          goToPrev={() => this.swipe('musicians', 'musicianIndex', -1)}
          goToNext={() => this.swipe('musicians', 'musicianIndex', 1)}
          index={this.state.eventIndex}
          title="Musicians Near You"
        >
          <h3>
            <Link onClick={() => this.props.updateUser(musician)} to={`/profile/${musician.username}`}>{musician.first_name} {musician.last_name}</Link>
          </h3>
          <span><strong>City:</strong> {musician.city}</span> <br />
          <span><strong>Skill:</strong> {musician.skill_level}</span>
        </BrowseBox>

        <BrowseBox
          goToPrev={this.goToPrev}
          goToNext={this.goToNext}
          index={this.state.eventIndex}
          title="Events"
        />

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
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

export default connect(mapStateToProps, mapDispatchToProps)(RightMainPageSideBar);
