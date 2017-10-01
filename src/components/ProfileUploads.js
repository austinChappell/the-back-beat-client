import React, { Component } from 'react';
import { connect } from 'react-redux';

import YouTube from 'react-youtube';

class ProfileUploads extends Component {
  render() {

    return (
      <div className="ProfileUploads">
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
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    currentUsername: state.currentUsername,
    currentUserVids: state.currentUserVids
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUploads);
