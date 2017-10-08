import React, { Component } from 'react';

class NewsFeedEvent extends Component {

  render() {

    let displayItem;
    let event = this.props.event;
    let iconClass = 'fa fa-play-circle-o';
    if (this.props.currentmp3 === event.mp3_url && this.props.isPlaying) {
      iconClass = 'fa fa-pause-circle-o';
    }

    if (event.type = 'status') {
      displayItem = <div>
        <i className={iconClass} aria-hidden="true" onClick={() => {this.props.play(event.mp3_url)}}></i>
        <p>{event.user_first_name} {event.user_last_name} is listening to <a href={event.song_url} target="_blank">{event.noun}</a> by <a href={event.artist_link} target="_blank">{event.artist_name}</a></p>
      </div>
    }

    return (
      <div className="NewsFeedEvent">
        {displayItem}
      </div>
    )
  }
}

export default NewsFeedEvent;
