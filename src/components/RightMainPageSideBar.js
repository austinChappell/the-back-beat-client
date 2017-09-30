import React, { Component } from 'react';
import { connect } from 'react-redux';

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
      console.log('DATA', data);
      this.setState({
        musicians: data
      });
    });
  }

  swipe = (itemsArray, itemIndexName, direction) => {
    const updateObj = {};
    if (this.state[itemIndexName] === this.state[itemsArray].length - 1) {
      updateObj[itemIndexName] = 0;
    } else {
      updateObj[itemIndexName] = this.state[itemIndexName] + direction;
    }
    this.setState(updateObj);
  }

  render() {

    return (
      <div className="RightMainPageSideBar">

        <UserBox />

        <BrowseBox
          displayTitle={this.state.musician.name}
          displayTitleURL={this.state.musician.url}
          goToPrev={() => this.swipe('musicians', 'musicianIndex', -1)}
          goToPrev={() => this.swipe('musicians', 'musicianIndex', 1)}
          index={this.state.eventIndex}
          title="Musicians Near You"
        />

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

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightMainPageSideBar);
