import React, { Component } from 'react';

class BandPage extends Component {
  render() {
    console.log('BAND PAGE PROPS', this.props.match.params.bandId);
    return (
      <div className="BandPage">
        Band Page Component
      </div>
    )
  }
}

export default BandPage;
