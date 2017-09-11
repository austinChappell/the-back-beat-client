import React, { Component } from 'react';
import { connect } from 'react-redux';

class NewsFeed extends Component {
  render() {
    return (
      <div className="NewsFeed">
        The NewsFeed Component
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
