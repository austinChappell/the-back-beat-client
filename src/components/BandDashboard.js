import React, { Component } from 'react';

import SideBar from './SideBar';

class BandDashboard extends Component {

  constructor(props) {
    super(props);

    const bandId = props.match.params.bandId;

    this.state = {
      sideBarLinks: [
        { title: 'Band Info', path: `/band/${bandId}` },
        { title: 'Dashboard', path: `/band/${bandId}/dashboard` },
        { title: 'Calendar', path: `/band/${bandId}/calendar` },
        { title: 'Uploads', path: `/band/${bandId}/uploads` },
        { title: 'Chat', path: `/band/${bandId}/chat` }
      ],
    }

  }

  render() {
    return (
      <div className="BandDashboard">
        <SideBar
          links={this.state.sideBarLinks}
          url={this.props.match.url}
        />
      </div>
    )
  }
}

export default BandDashboard;
