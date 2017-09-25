import React, { Component } from 'react';
import { connect } from 'react-redux';

class MusicianCarousel extends Component {

  state = {
    displayIndeces: [],
  }

  render() {
    return (
      <div className="MusicianCarousel">

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
