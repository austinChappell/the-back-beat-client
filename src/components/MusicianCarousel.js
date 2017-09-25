import React, { Component } from 'react';
import { connect } from 'react-redux';

class MusicianCarousel extends Component {

  state = {
    displayIndeces: [],
  }

  render() {

    console.log('SEARCH RESULTS IN CAROUSEL', this.props.searchResults);

    let resultsDisplay;

    if (this.props.searchResults.length > 0) {
      resultsDisplay = <div>
        {this.props.searchResults.map((result, index) => {
          return (
            <div key={index} className='single-result'>
              <h1>{result.first_name} {result.last_name}</h1>
            </div>
          )
        })}
      </div>
    }

    return (
      <div className="MusicianCarousel">
        {resultsDisplay}
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
