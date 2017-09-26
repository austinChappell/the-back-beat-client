import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    let slider;

    if (this.props.searchResults.length > 0) {
      resultsDisplay = <div className="slider">
        {this.props.searchResults.map((result, index) => {
          let left = (index * 100) + this.props.sliderPosition;
          return (
            <div
              key={index}
              className='single-result'
              style={{left: left + '%'}}>
              <h1>{result.first_name} {result.last_name}</h1>
              <h2>{result.city}</h2>
              <h2>{result.skill_level}</h2>
              <span>Message</span>
            </div>
          )
        })}
      </div>
    } else {
      resultsDisplay = <div className="no-results">
        <p>{this.props.noResultsMsg}</p>
      </div>
    }

    return (
      <div className="MusicianCarousel">
        <i
          className={this.props.sliderPosition === 0 ? "fa fa-chevron-left disabled-btn" : "fa fa-chevron-left"}
          aria-hidden="true"
          style={this.props.searchResults.length > 0 ? {display: 'block'} : {display: 'none'}}
          onClick={() => this.props.slideCarousel(100)}></i>
        {resultsDisplay}
        <i
          className={this.props.sliderPosition === (this.props.searchResults.length - 1) * -100
            ?
            "fa fa-chevron-right disabled-btn"
            :
            "fa fa-chevron-right"}
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
