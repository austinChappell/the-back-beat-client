import React, { Component } from 'react';
import { connect } from 'react-redux';

class BandUploads extends Component {

  render() {
    return (
      <div className="BandUploads">
        Band Uploads Component
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

export default connect(mapStateToProps, mapDispatchToProps)(BandUploads)
