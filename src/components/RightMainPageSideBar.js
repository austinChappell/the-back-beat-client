import React, { Component } from 'react';
import { connect } from 'react-redux';

import BrowseBox from './BrowseBox';
import UserBox from './UserBox';

class RightMainPageSideBar extends Component {

  state = {
    eventIndex: 0
  }

  render() {

    return (
      <div className="RightMainPageSideBar">

        <UserBox />

        <BrowseBox
          displayTitle={this.musician.name}
          displayTitleURL={this.msu}
          goToPrev={this.goToPrev}
          goToNext={this.goToNext}
          index={this.state.eventIndex}
          title="Musicians Near You"
        />

        <BrowseBox
          goToPrev={this.goToPrev}
          goToNext={this.goToNext}
          index={this.state.eventIndex}
          title="Events"
        />

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

export default connect(mapStateToProps, mapDispatchToProps)(RightMainPageSideBar);
