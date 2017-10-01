import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import BrowseBox from './BrowseBox';
import YouTube from 'react-youtube';

class RightMainPageSideBar extends Component {

  state = {
    eventIndex: 0,
    eventIndexRange: [0, 1],
    musicianIndex: 0,
    musicianIndexRange: [0, 1],
    musicianOffset: 0,
  }

  changeUser = (user) => {
    this.props.updateUser(user);
    this.updateUserInstruments(user.id);
  }

  swipe = (itemsArray, itemIndexName, direction) => {

    const updateObj = {
      musicianOffset: this.state.musicianOffset + (direction * -100)
    };
    if (this.state[itemIndexName] === this.props[itemsArray].length - 1 && direction === 1) {
      updateObj[itemIndexName] = 0;
    } else if (this.state[itemIndexName] === 0 && direction === -1) {
      updateObj[itemIndexName] = this.props[itemsArray].length - 1;
    } else {
      updateObj[itemIndexName] = this.state[itemIndexName] + direction;
    }
    this.setState(updateObj);
  }

  updateUser = (user) => {
    this.props.updateUser(user);
    this.updateUserInstruments(user.id);
  }

  updateUserInstruments = (userid) => {

    const url = this.props.apiURL;
    fetch(`${url}/api/instrumentuser/${userid}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.updateUserInstruments(results.rows);
    })

  }

  render() {

    let musicianIndex = this.state.musicianIndex;

    let musician = {};
    let prevMusician = {};
    let nextMusician = {};
    if (this.props.compatibleMusicians.length > 0) {
      musician = this.props.compatibleMusicians[musicianIndex];
      prevMusician = this.props.compatibleMusicians[musicianIndex - 1];
      nextMusician = this.props.compatibleMusicians[musicianIndex + 1];
      if (musicianIndex === 0) {
        prevMusician = this.props.compatibleMusicians[this.props.compatibleMusicians.length - 1];
      } else if (musicianIndex === this.props.compatibleMusicians.length - 1) {
        nextMusician = this.props.compatibleMusicians[0];
      }
    }

    return (
      <div className="RightMainPageSideBar">

        <BrowseBox
          currentIndex={this.state.musicianIndex}
          goToPrev={() => this.swipe('compatibleMusicians', 'musicianIndex', -1)}
          goToNext={() => this.swipe('compatibleMusicians', 'musicianIndex', 1)}
          minIndex={0}
          maxIndex={this.props.compatibleMusicians.length - 1}
          index={this.state.musicianIndex}
          title="Musicians You Might Like"
        >
          <div className="browse-box-container">

            {this.props.compatibleMusicians.map((musician, index) => {

              const startingPosition = (index) * 100;
              const leftString = String(startingPosition + this.state.musicianOffset) + '%';

              return (

                <div key={index} className="show-item" style={{left: leftString}}>

                  <h3>
                    <Link onClick={() => this.updateUser(musician)} to={`/profile/${musician.username}`}>{musician.first_name} {musician.last_name}</Link>
                  </h3>
                  <span><strong>City:</strong> {musician.city}</span> <br />
                  {/* <span><strong>Skill:</strong> {musician.skill_level}</span> */}

                  <YouTube
                    videoId="EgfiYz4jo8I"
                    opts={{width: '200', height: '130'}}
                    ref={'video' + index}
                  />

                  {/* <iframe width="200" height="130" src="https://www.youtube.com/watch?v=EgfiYz4jo8I"></iframe> */}

                </div>

              )

            })}

        </div>

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
    apiURL: state.apiURL,
    compatibleMusicians: state.compatibleMusicians,
    currentUser: state.currentUser,
    loggedInUser: state.loggedInUser,
    loggedInUserSkill: state.loggedInUser.skill_level,
    skillLevels: state.skillLevels,
    userStyleIds: state.userStyleIds
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => {
      const action = { type: 'UPDATE_USER', user };
      dispatch(action);
    },

    updateUserInstruments: (instruments) => {
      const action = { type: 'UPDATE_INSTRUMENTS', instruments };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightMainPageSideBar);
