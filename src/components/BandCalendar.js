import React, { Component } from 'react';
import { connect } from 'react-redux';

import ContentAdd from 'material-ui/svg-icons/content/add';
import EventCreator from './EventCreator';
import EventList from './EventList';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SideBar from './SideBar';

class BandCalendar extends Component {

  constructor(props) {
    super(props);

    const bandId = props.match.params.bandId;

    this.state = {
      bandAdminId: null,
      bandEvents: [],
      bandInfoArr: [],
      displayModal: false,
      eventTypes: [
        { value: 'Gig', text: 'Gig' },
        { value: 'Rehearsal', text: 'Rehearsal' }
      ],
      sideBarLinks: [
        { title: 'Band Info', path: `/band/${bandId}` },
        { title: 'Dashboard', path: `/band/${bandId}/dashboard` },
        { title: 'Calendar', path: `/band/${bandId}/calendar` },
        { title: 'Uploads', path: `/band/${bandId}/uploads` },
        { title: 'Chat', path: `/band/${bandId}/chat` }
      ],
    }

  }

  componentDidMount() {
    this.getBandInfo();
    this.getEvents();
  }

  closeModal = () => {
    this.setState({ displayModal: false }, () => {
      this.getEvents();
    })
  }

  getEvents = () => {
    const url = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${url}/api/gig/band/${bandId}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bandEvents: results.rows });
    })
  }

  getBandInfo = () => {
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${apiURL}/api/band/${bandId}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bandInfoArr: results.rows });
      this.setState({ bandAdminId: results.rows[0].band_admin_id });
    })
  }

  showModal = () => {
    this.setState({ displayModal: true });
  }

  render() {

    let addButton;
    let createEventForm;

    if (this.state.bandInfoArr.length > 0) {

      createEventForm = this.props.loggedInUser.id === this.state.bandAdminId ?
      <EventCreator
        closeModal={this.closeModal}
        displayModal={this.state.displayModal}
        eventTypes={this.state.eventTypes}
        submitQuery={`api/gig/band/${this.props.match.params.bandId}`}
      />
      :
      null;

      addButton = this.props.loggedInUser.id === this.state.bandAdminId ?
      <FloatingActionButton
        mini={true}
        secondary={true}
        onClick={this.showModal}
        >
          <ContentAdd />
        </FloatingActionButton>
        :
        null;

    }

    return (
      <div className="BandCalendar">
        <SideBar
          links={this.state.sideBarLinks}
          url={this.props.match.url}
        />
        {createEventForm}
        <div className="band-events">
          <h2>Gigs and Rehearsals {addButton}</h2>
          <EventList
            data={this.state.bandEvents}
            url="band_event"
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandCalendar);
