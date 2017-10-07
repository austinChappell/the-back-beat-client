import React, { Component } from 'react';
import { connect } from 'react-redux';

class BrowseBox extends Component {
  render() {
    return (
      <div className="BrowseBox">
        <h2>{this.props.title}</h2>
        <div className="browse-box-flex">
          <i
            className={this.props.currentIndex === 0 ? "fa fa-chevron-left chevron hidden" : "fa fa-chevron-left chevron"}
            onClick={this.props.currentIndex > 0 ? this.props.goToPrev : () => {}}
            aria-hidden="true"></i>
          {this.props.children}
          <i
            className={this.props.currentIndex === this.props.maxIndex ? "fa fa-chevron-right chevron hidden" : "fa fa-chevron-right chevron"}
            onClick={this.props.currentIndex < this.props.maxIndex ? this.props.goToNext : () => {}}
            aria-hidden="true"></i>
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
