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
    showDialog: false,
    track: '',
    mediaType: ''
  }

  closeDialog = () => {
    this.setState({showDialog: false});
  }

  showDialog = (addUploadMsg, mediaType) => {
    this.setState({showDialog: true, addUploadMsg, mediaType});
  }

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={(evt) => this.updateTracks(evt)}
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

    if (this.state.mediaType === 'tracks') {
      currentMedia = <div>
        {this.props.currentUserTracks.map((track, index) => {
          return (
            <div>
              <h2>{track.track_url}</h2>
            </div>
          )
        })}
      </div>
    } else {
      currentMedia = <div>
        {this.props.currentUserVids.map((video, index) => {
          return (
            <div>
              <h2>{video.video_title}</h2>
            </div>
          )
        })}
      </div>
    }

    return (
      <div className="ProfileUploads">
        <div className="audio-tracks">
          <h2 style={{ display: 'inline' }}>Audio Tracks</h2>{editTracks}
          {this.props.currentUserTracks.map((track, index) => {
            return (
              <div className="track-result" key={index}>
                <iframe width="80%" height="20" scrolling="no" frameborder="no" style={{ border: 'none' }} src={`https://w.soundcloud.com/player/?url=${track.track_url}&amp;color=ff5500&amp;inverse=false&amp;auto_play=false&amp;show_user=true`}></iframe>
              </div>
            )
          })}
        </div>

        <div className="videos">
          <h2 style={{ display: 'inline' }}>Videos</h2>{editVids}
          {this.props.currentUserVids.map((video, index) => {
            return (
              <div className="video-result" key={index}>

                <h3>{video.video_title}</h3>
                <YouTube
                  videoId={video.youtube_id}
                  opts={{width: '400', height: '300'}}
                />
                <p>{video.video_description}</p>

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
            onChange={(evt) => this.handleChange(evt, 'eventTitle')}
            value={this.state.eventTitle}
          />

        </Dialog>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    currentUsername: state.currentUsername,
    currentUserTracks: state.currentUserTracks,
    currentUserVids: state.currentUserVids,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUploads);
