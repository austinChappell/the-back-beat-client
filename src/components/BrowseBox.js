import React, { Component } from 'react';
import { connect } from 'react-redux';

class BrowseBox extends Component {
  render() {
    return (
      <div className="BrowseBox">
        <h2>{this.props.title}</h2>
        <div className="browse-box-flex">
          <i
            className={this.props.currentIndex === 0 ? "fa fa-arrow-circle-left chevron hidden" : "fa fa-arrow-circle-left chevron"}
            onClick={this.props.currentIndex > 0 ? this.props.goToPrev : () => {}}
            aria-hidden="true"></i>
          {this.props.children}
          <i
            className={this.props.currentIndex === this.props.maxIndex ? "fa fa-arrow-circle-right chevron hidden" : "fa fa-arrow-circle-right chevron"}
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
