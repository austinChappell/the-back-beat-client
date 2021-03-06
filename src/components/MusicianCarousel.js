import React, { Component } from 'react';
import { connect } from 'react-redux';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import MessageIcon from 'material-ui-icons/Message';
import YouTube from 'react-youtube';

class MusicianCarousel extends Component {

  state = {
    displayIndeces: [],
    sliderPosition: 0
  }

  componentDidMount() {
    console.log('COMPONENT MOUNTED');
  }

  render() {

    let resultsDisplay;
    if (this.props.searchResults.length > 0) {
      resultsDisplay = <div className="slider">
        {this.props.searchResults.map((musician, index) => {
          let primaryVid;
          if (musician.primary_vid_id) {
            primaryVid = <YouTube
              videoId={musician.primary_vid_id}
              opts={{width: '400', height: '260'}}
              ref={'video' + index}
            />
          } else {
            primaryVid = <img src={musician.profile_image_url} alt={musician.first_name} />
          }

          let left = (index * 100) + this.props.sliderPosition;
          return (
            <div
              key={index}
              className='single-result'
              style={{left: left + '%'}}>
              <h1 className="name">{musician.first_name} {musician.last_name}</h1>
              <h2 className="skill">{musician.skill_level}</h2>
              {primaryVid}
            </div>
          )
        })}
        <FloatingActionButton
          onClick={this.props.writeMessage}
          style={{
            alignSelf: 'flex-start',
            bottom: '15px',
            right: '15px',
            position: 'absolute'
          }}
        >
          <MessageIcon />
        </FloatingActionButton>
      </div>
    } else {
      resultsDisplay = <div className="no-results">
        <p>{this.props.noResultsMsg}</p>
      </div>
    }

    return (
      <div className="MusicianCarousel">
        <i
          className={this.props.sliderPosition === 0 ? "fa fa-arrow-circle-left disabled-btn" : "fa fa-arrow-circle-left"}
          aria-hidden="true"
          style={this.props.searchResults.length > 0 ? {display: 'block'} : {display: 'none'}}
          onClick={() => this.props.slideCarousel(100)}></i>
        {resultsDisplay}
        <i
          className={this.props.sliderPosition === (this.props.searchResults.length - 1) * -100
            ?
            "fa fa-arrow-circle-right disabled-btn"
            :
            "fa fa-arrow-circle-right"}
          aria-hidden="true"
          style={this.props.searchResults.length > 0 ? {display: 'block'} : {display: 'none'}}
          onClick={() => this.props.slideCarousel(-100)}></i>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    skillLevels: state.skillLevels
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicianCarousel);
