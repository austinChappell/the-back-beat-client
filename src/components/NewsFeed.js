import React, { Component } from 'react';
import { connect } from 'react-redux';

import FormInput from './FormInput';
import NewsFeedEvent from './NewsFeedEvent';
import ReactAudioPlayer from 'react-audio-player';
import {List, ListItem} from 'material-ui/List';

class NewsFeed extends Component {

  state = {
    artistSearch: '',
    isPlaying: false,
    mp3: '',
    musicResults: [],
    loading: true,
    news: []
  }

  componentDidMount() {
    this.getNews();
  }

  handleInputChange = (evt) => {
    let value = evt.target.value;
    this.setState({ artistSearch: evt.target.value }, () => {
      setTimeout(() => {
        if (value === this.state.artistSearch) {
          fetch(`https://itunes.apple.com/search?term=${value}&limit=15`, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((response) => {
            return response.json();
          }).then((results) => {
            console.log('SEARCH RESULTS', results.results);
            this.setState({ musicResults: results.results });
          })
        }
      }, 250);
    });
  }

  addSong = (result) => {
    const url = this.props.apiURL;
    fetch(`${url}/api/addsong?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'POST',
      body: JSON.stringify(result)
    }).then((response) => {
      return response.json();
    }).then((results) => {
      let array = this.state.news.slice();
      array.unshift(results.rows[0]);
      this.setState({ news: array, artistSearch: '', musicResults: [] });
    })
  }

  getNews = () => {
    const url = this.props.apiURL;
    fetch(`${url}/api/getnews?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('NEWS', results.rows);
      this.setState({ news: results.rows });
    })
  }

  play = (mp3) => {
    if (this.state.isPlaying && mp3 === this.state.mp3) {
      this.setState({ mp3: '', isPlaying: false });
    } else {
      this.setState({ mp3, isPlaying: true });
      setTimeout(() => {
        this.setState({ isPlaying: false, mp3: '' });
      }, 30000)
    }
  }

  render() {
    return (
      <div className="NewsFeed">
        <div>
          <FormInput
            name="artistSearch"
            placeholder="What are you listening to?"
            onChange={this.handleInputChange}
            type="text"
            value={this.state.artistSearch}
          />
          <List className="itunes-results" style={{display: this.state.musicResults.length > 0 ? 'block' : 'none'}}>
            {this.state.musicResults.map((result, index) => {
              return (
                <ListItem key={index} onClick={() => this.addSong(result)}>
                  <span>{result.trackName}</span> - {result.artistName}
                </ListItem>
              )
            })}
          </List>
        </div>
        <ReactAudioPlayer
          src={this.state.mp3}
          autoPlay
          controls
          style={{display: 'none'}}
        />
        {this.state.news.map((event, index) => {
          return (
            <NewsFeedEvent
              key={index}
              event={event}
              play={this.play}
              currentmp3={this.state.mp3}
              isPlaying={this.state.isPlaying}
            />
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allEventsInCity: state.allEventsInCity,
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser
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

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
