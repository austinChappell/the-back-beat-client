import React, { Component } from 'react';
import { connect } from 'react-redux';

class BrowseBox extends Component {
  render() {
    return (
      <div className="BrowseBox">
        <h2>{this.props.title}</h2>
        {this.props.children}
        <div className="buttons">
          <button onClick={this.props.goToPrev}>Prev</button>
          <button onClick={this.props.goToNext}>Next</button>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BrowseBox);
