import React, { Component } from 'react';
import { connect } from 'react-redux';

import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import YouTube from 'react-youtube';

class ProfileUploads extends Component {

  state = {
    addUploadMsg: '',
    currentMediaItems: [],
    mediaTitle: '',
    mediaType: '',
    showDialog: false,
    track: ''
  }

  addURL = () => {
    const currentMediaItems = this.state.currentMediaItems;
    const newItem = {};
    newItem.user_id = this.props.loggedInUser.id;
    newItem.set_as_primary = currentMediaItems.length === 0;
    if (this.state.mediaType === 'tracks') {
      newItem.track_url = this.state.mediaTitle;
      currentMediaItems.push(newItem);
      this.setState({ currentMediaItems, mediaTitle: '' });
    } else {
      newItem.youtube_id = this.getYouTubeId(this.state.mediaTitle);
      console.log('youtube id', newItem.youtube_id);
      fetch(`https://www.googleapis.com/youtube/v3/videos?id=${newItem.youtube_id}&key=${this.props.YOUTUBE_API_KEY}&fields=items(snippet(channelId,title,categoryId))&part=snippet`).then((response) => {
        return response.json();
      }).then((results) => {
        newItem.title = results.items[0].snippet.title;
        console.log('NEW ITEM', newItem);
        currentMediaItems.push(newItem);
        this.setState({ currentMediaItems, mediaTitle: '' });
      }).catch((err) => {
        console.log('error', err);
      })
    }
  }

  closeDialog = () => {
    this.setState({ mediaTitle: '', showDialog: false });
  }

  handleChange = (evt, key) => {
    console.log(evt.target.value);
    const o = {};
    o[key] = evt.target.value;
    this.setState(o);
  }

  handleRadioChange = (evt, index) => {
    const currentMediaItems = this.state.currentMediaItems.slice();
    console.log(index);
    currentMediaItems.forEach((item) => {
      item.set_as_primary = false;
    });
    currentMediaItems[index].set_as_primary = true;
    console.log('state items', currentMediaItems);
    console.log('prop items', this.props.currentUserTracks);
    this.setState({ currentMediaItems });
  }

  handleTrackLinkSubmit = (evt, array, url) => {
    evt.preventDefault();
    let errorMessage;
    // LOOSE EQUALS FALSE TO AVOID A STRING OF SPACES BEING SUBMITTED
    if (this.state.mediaTitle != false) {
      if (this.state.selectedTracks.length >= this.state.trackMax) {
        errorMessage = `You may only submit ${this.state.trackMax} audio tracks`;
      } else {
        errorMessage = null;
        const updateState = {};
        const updateArray = this.state[array].slice();

        updateArray.push({
          set_as_primary: false,
          track_url: this.state[url]
        });
        updateState[array] = updateArray;
        updateState[url] = '';
        this.setState(updateState);
      }
    } else {
      errorMessage = 'You must complete all fields before adding a track';
    }
    this.setState({ errorMessage });
  }

  getYouTubeId = (videoURL) => {

    let queryIndex = videoURL.indexOf('?v=');
    let vidID = videoURL.slice(queryIndex + 3, videoURL.length);
    return vidID;

  }

  handleVidLinkSubmit = (evt, array, url, title, description) => {
    evt.preventDefault();
    let errorMessage;
    if (this.state.pendingVideo != false && this.state.pendingVideoTitle != false && this.state.pendingVideoDescription != false) {
      if (this.state.selectedVideos.length >= this.state.videoMax) {
        errorMessage = 'You may only submit three videos';
      } else {
        errorMessage = null;
        const updateState = {};
        const updateArray = this.state[array].slice();

        updateArray.push({
          // set_as_primary: false,
          // youtube_id: vidID
        });
        updateState[array] = updateArray;
        updateState[url] = '';
        this.setState(updateState);
      }
    } else {
      errorMessage = 'You must complete all fields before adding a video';
    }
    this.setState({ errorMessage });
  }

  removeItem = (index) => {
    console.log(index);
    const currentMediaItems = this.state.currentMediaItems;
    let removedPrimary = currentMediaItems[index].set_as_primary === true;
    currentMediaItems.splice(index, 1);
    if (removedPrimary && currentMediaItems.length > 0) {
      currentMediaItems[0].set_as_primary = true;
    }
    this.setState({ currentMediaItems });
  }

  convertArrayOfObjects = (oldArray, newArray) => {
    oldArray.forEach((item) => {
      newArray.push(Object.assign({}, item));
    })
  }

  showDialog = (addUploadMsg, mediaType) => {
    this.setState({showDialog: true, addUploadMsg, mediaType});
    const currentMediaItems = [];
    if (mediaType === 'tracks') {
      this.convertArrayOfObjects(this.props.currentUserTracks, currentMediaItems);
      this.setState({ currentMediaItems });
    } else {
      this.convertArrayOfObjects(this.props.currentUserVids, currentMediaItems);
      currentMediaItems.forEach((item) => {
        fetch(`https://www.googleapis.com/youtube/v3/videos?id=${item.youtube_id}&key=${this.props.YOUTUBE_API_KEY}&fields=items(snippet(channelId,title,categoryId))&part=snippet`).then((response) => {
          return response.json();
        }).then((results) => {
          item.title = results.items[0].snippet.title;
          this.setState({ currentMediaItems });
        }).catch((err) => {
          console.log('error', err);
        })
      })
    }
  }

  deleteMediaItems = () => {
    const apiURL = this.props.apiURL;
    console.log('delete fetch about to run');
    fetch(`${apiURL}/api/user/${this.state.mediaType}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'DELETE',
    }).then(() => {
      console.log('run update');
      this.updateMediaItems();
    }).catch((err) => {
      console.log('error', err);
    })
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    // TODO: IMPLELEMENT A LOADING SPINNER
    this.deleteMediaItems();
    this.state.currentMediaItems.forEach((item) => {
      console.log('looping through media items');
      if (item.set_as_primary === true) {
        if (this.state.mediaType === 'tracks') {
          this.updatePrimaryUrl(item.track_url);
        } else if (this.state.mediaType === 'vids') {
          this.updatePrimaryUrl(item.youtube_id);
        }
      }
    })
  };

  // TODO: this is bad. needs to be refactored. will take about 1-2 hours, as many steps are involved
  updatePrimaryUrl = (id) => {
    console.log('running update');
    const apiURL = this.props.apiURL;
    let query = this.state.mediaType === 'tracks' ? `trackprimary` : `vidprimary/${id}`;
    let method = this.state.mediaType === 'tracks' ? 'PUT' : 'POST'

    fetch(`${apiURL}/api/user/${query}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: method,
      body: JSON.stringify({
        track_url: id
      })
    }).catch((err) => {
      console.log('error', err);
    })
  }

  updateMediaItems = () => {
    const apiURL = this.props.apiURL;
    const thisComponent = this;
    let fetchCounter = 0;
    console.log('about to loop over media items');
    this.state.currentMediaItems.forEach((item) => {
      console.log('running fetch');
      fetch(`${apiURL}/api/user/${this.state.mediaType}/token/${localStorage.token}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',

        },
        method: 'POST',
        body: JSON.stringify({item})
      }).then(() => {
        fetchCounter++;
        console.log('fetch counter', fetchCounter);
        console.log(this.state.currentMediaItems.indexOf(item));
        console.log(this.state.currentMediaItems.length);
        if (fetchCounter === this.state.currentMediaItems.length) {
          this.updateUserTracks(this.props.loggedInUser.id);
          this.updateUserVids(this.props.loggedInUser.id);
          this.setState({ showDialog: false });
        }
      })
    })
  }

  updateUserTracks = (userid) => {

    const url = this.props.apiURL;
    fetch(`${url}/api/user/tracks/${userid}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.setCurrentUserTracks(results.rows);
    });

  }

  updateUserVids = (userid) => {

    const url = this.props.apiURL;
    fetch(`${url}/api/user/vids/${userid}/token/${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.setCurrentUserVids(results.rows);
    });
  }

  render() {

    console.log('STATE', this.state);
    console.log('API KEY', this.props.YOUTUBE_API_KEY);

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeDialog}
      />,
      <FlatButton
        label="Update"
        primary={true}
        onClick={(evt) => this.handleSubmit(evt)}
      />,
    ];

    let currentMedia = null;
    let editTracks = null;
    let editVids = null;

    if (this.props.currentUser.id === this.props.loggedInUser.id) {
      editTracks = <i
        className="fa fa-pencil-square-o"
        aria-hidden="true"
        onClick={() => this.showDialog('Add Audio Track URL', 'tracks')}
        style={{marginLeft: '10px'}}
      >
      </i>

      editVids = <i
        className="fa fa-pencil-square-o"
        aria-hidden="true"
        onClick={() => this.showDialog('Add YouTube Video URL', 'vids')}
        style={{marginLeft: '10px'}}
      >
      </i>
    }

    currentMedia = <div>
      {this.state.currentMediaItems.map((item, index) => {
        return (
          <div key={index}>
            <input
              type="radio"
              checked={item.set_as_primary}
              onClick={(evt) => this.handleRadioChange(evt, index)}
            />
            <h4 style={{ display: 'inline-block' }}>{item.track_url || item.title}</h4>
            <i
              className="fa fa-times-circle remove-button"
              aria-hidden="true"
              onClick={() => this.removeItem(index)}
              ></i>
          </div>
        )
      })}
    </div>

    return (
      <div className="ProfileUploads">
        <div className="audio-tracks">
          <h2 style={{ display: 'inline' }}>Audio Tracks</h2>{editTracks}
          {this.props.currentUserTracks.map((track, index) => {
            return (
              <div className="track-result" key={index}>
                <iframe width="80%" height="20" scrolling="no" style={{ border: 'none' }} src={`https://w.soundcloud.com/player/?url=${track.track_url}&amp;color=ff5500&amp;inverse=false&amp;auto_play=false&amp;show_user=true`}></iframe>
              </div>
            )
          })}
        </div>

        <div className="videos">
          <h2 style={{ display: 'inline' }}>Videos</h2>{editVids}
          {this.props.currentUserVids.map((video, index) => {
            return (
              <div className="video-result" key={index}>

                <YouTube
                  videoId={video.youtube_id}
                  opts={{width: '400', height: '300'}}
                />

              </div>
            )
          })}
        </div>

        <Dialog
          modal={false}
          actions={actions}
          open={this.state.showDialog}
          onRequestClose={this.closeDialog}
        >

          {currentMedia}

          <TextField
            floatingLabelText={this.state.addUploadMsg}
            onChange={(evt) => this.handleChange(evt, 'mediaTitle')}
            value={this.state.mediaTitle}
          />
          <FloatingActionButton
            mini={true}
            secondary={true}
            onClick={this.addURL}
            >
              <ContentAdd />
            </FloatingActionButton>

        </Dialog>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    currentUser: state.currentUser,
    currentUsername: state.currentUsername,
    currentUserTracks: state.currentUserTracks,
    currentUserVids: state.currentUserVids,
    loggedInUser: state.loggedInUser,
    YOUTUBE_API_KEY: state.YOUTUBE_API_KEY
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentUserTracks: (tracks) => {
      const action = { type: 'SET_CURRENT_USER_TRACKS', tracks };
      dispatch(action);
    },
    setCurrentUserVids: (videos) => {
      const action = { type: 'SET_CURRENT_USER_VIDS', videos };
      dispatch(action);
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUploads);
