import React, { Component } from 'react';
import { connect } from 'react-redux';

class BrowseBox extends Component {
  render() {
    return (
      <div className="BrowseBox">
        <h2>{this.props.title}</h2>
        {this.props.children}
        <div className="buttons">
          <button
            disabled={this.props.currentIndex === 0}
            onClick={this.props.currentIndex > 0 ? this.props.goToPrev : () => {}}
          >
            Prev
          </button>
          <button
            disabled={this.props.currentIndex === this.props.maxIndex}
            onClick={this.props.currentIndex < this.props.maxIndex ? this.props.goToNext : () => {}}
          >
            Next
          </button>
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
