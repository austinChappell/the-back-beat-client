import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageSearchBar extends Component {

  render() {
    return (
      <div className="MessageSearchBar">
        Message Search Bar
        <input value={this.props.searchValue} onChange={this.props.handleChange} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

export default connect(mapStateToProps)(MessageSearchBar);
