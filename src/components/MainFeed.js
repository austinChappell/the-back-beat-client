import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import BandBox from './BandBox';
import BrowseBox from './BrowseBox';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import YouTube from 'react-youtube';

class MainFeed extends Component {

  state = {
    eventIndex: 0,
    eventIndexRange: [0, 1],
    eventOffset: 0,
    musicianIndex: 0,
    musicianIndexRange: [0, 1],
    musicianOffset: 0,
    placeholder: 'src/assets/images/placeholder.png'
  }

  // componentWillMount() {
    // setTimeout(() => {
      // this.loadEvents();
    // }, 0);
  // }

  // loadEvents = () => {
  //   const url = this.props.apiURL;
  //   fetch(`${url}/api/events/city`, {
  //     credentials: 'include',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then((response) => {
  //     return response.json();
  //   }).then((results) => {
  //     if (results.rows) {
  //       this.props.loadEvents(results.rows);
  //       this.setState({ loading: false });
  //     }
  //   })
  // }

  handleAttendance = (evt, eventId, attending) => {
    const url = this.props.apiURL;
    evt.target.classList.add('selected');
    if (attending) {
      evt.target.nextElementSibling.style.display = 'none';
    } else {
      evt.target.previousElementSibling.style.display = 'none';
    }
    fetch(`${url}/api/event/attendance`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        eventId,
        attending
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log(results);
    })
  }

  swipe = (itemsArray, itemIndexName, itemOffset, direction) => {

    console.log('button clicked', itemsArray, itemIndexName, itemOffset, direction);

    const updateObj = {};
    updateObj[itemOffset] = this.state[itemOffset] + (direction * -100);
    if (this.state[itemIndexName] === this.props[itemsArray].length - 1 && direction === 1) {
      updateObj[itemIndexName] = 0;
    } else if (this.state[itemIndexName] === 0 && direction === -1) {
      updateObj[itemIndexName] = this.props[itemsArray].length - 1;
    } else {
      updateObj[itemIndexName] = this.state[itemIndexName] + direction;
    }
    this.setState(updateObj);
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
      <div className="MainFeed">

        <BrowseBox
          currentIndex={this.state.musicianIndex}
          goToPrev={() => this.swipe('compatibleMusicians', 'musicianIndex', 'musicianOffset', -1)}
          goToNext={() => this.swipe('compatibleMusicians', 'musicianIndex', 'musicianOffset', 1)}
          minIndex={0}
          maxIndex={this.props.compatibleMusicians.length - 1}
          index={this.state.musicianIndex}
          // title="Musicians You Might Like"
        >
          <div className="browse-box-container">

            {this.props.compatibleMusicians.map((musician, index) => {

              const startingPosition = (index) * 100;
              const leftString = String(startingPosition + this.state.musicianOffset) + '%';
              let video = <img src={require("../assets/images/placeholder.png")} alt="placeholder" />;
              // let video = null;
              if (musician.primary_vid_id) {
                video = <YouTube
                  videoId={musician.primary_vid_id}
                  // opts={{width: '400', height: '260'}}
                  ref={'video' + index}
                />

              } else if (musician.has_profile_photo) {
                video = <img src={`${this.props.apiURL}/files/profile_images/profile_image_${musician.id}.jpg?v=1}`} />
              }

              return (
                <div key={index} className="show-item" style={{left: leftString}}>

                  <Card style={{ width: '500px', height: '650px', margin: '20px auto', boxShadow: '2px 2px 30px gray', borderRadius: '5px' }}>

                    <div className="card-header">

                      <h3>
                        <Link to={`/profile/${musician.username}`}>{musician.first_name} {musician.last_name}</Link>
                      </h3>
                      <span>{musician.city}</span> <br />
                      <span>{musician.skill_level}</span> <br />

                    </div>

                    <div className="card-hero-image">

                      {video}

                    </div>

                    <div className="card-bio">

                      <p>{musician.bio}</p>

                    </div>

                  </Card>

                </div>
              )
            })}

        </div>

        </BrowseBox>

        {/* <BandBox /> */}

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allEventsInCity: state.allEventsInCity,
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

    loadEvents: (events) => {
      const action = {type: 'LOAD_EVENTS', events};
      dispatch(action);
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainFeed);
