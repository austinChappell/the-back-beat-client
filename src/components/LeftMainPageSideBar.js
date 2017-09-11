import React, { Component } from 'react';
import { connect } from 'react-redux';

import ScrollBox from './ScrollBox';

class LeftMainPageSideBar extends Component {

  constructor() {
    super();

    this.state = {
      gigs: [
        {title: 'United Methodist', details: '9/23 - 7:00pm'},
        {title: 'Andy\'s', details: '9/25 - 9:00pm'},
        {title: 'House of Blues', details: '9/30 - 10:00pm'}
      ]
    }
  }

  render() {
    return (
      <div className="LeftMainPageSideBar">
        <ScrollBox title="Your Gigs" data={this.state.gigs} />
        <ScrollBox title="Your Friends" data={this.state.gigs} />
        <ScrollBox title="Your Bands" data={this.state.gigs} />
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

export default connect(mapStateToProps, mapDispatchToProps)(LeftMainPageSideBar);
