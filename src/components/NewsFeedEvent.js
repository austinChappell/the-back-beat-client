import React, { Component } from 'react';

class NewsFeedEvent extends Component {

  render() {

    let displayItem;
    let event = this.props.event;

    if (event.type = 'status') {
      displayItem = <div>
        <button>Play</button>
        <p>{event.user_first_name} {event.user_last_name} is listening to {event.noun} by <a href={event.artist_link} target="_blank">{event.artist_name}</a></p>
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
