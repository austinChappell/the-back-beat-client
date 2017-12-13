import React, { Component } from 'react';
import { connect } from 'react-redux';

import BigCalendar from 'react-big-calendar';
import ContentAdd from 'material-ui/svg-icons/content/add';
import EventCreator from './EventCreator';
import EventList from './EventList';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import moment from 'moment';
import Previewer from './Previewer';
import SideBar from './SideBar';

moment().format();

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

class BandCalendar extends Component {

  constructor(props) {
    super(props);

    const bandId = props.match.params.bandId;

    this.state = {
      bandAdminId: null,
      bandEvents: [],
      bandInfoArr: [],
      currentEvent: null,
      displayModal: false,
      eventPendingDate: {},
      eventTypes: [
        { value: 'Gig', text: 'Gig' },
        { value: 'Rehearsal', text: 'Rehearsal' }
      ],
      previewEvent: false,
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

  closePreviewer = () => {
    this.setState({ previewEvent: false });
  }

  EventAgenda = ({ event }) => {
    return <span style={{ color: '#ffffff' }}>
      <em style={{ color: '#9A6197', fontWeight: '600' }}>{event.title}</em>
      <p style={{ fontWeight: '100' }}>{ event.desc }</p>
    </span>
  }

  eventStyle = (event, start, end, isSelected) => {
    let backgroundColor = '#070649';
    if (event.event_type === 'Rehearsal') {
      backgroundColor = '#9A6197';
    }
    const style = {
      backgroundColor,
    };
    return {
      style
    };
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
      const events = results.rows;
      events.forEach((event) => {
        console.log('THE EVENT', event);
        let d = new Date(event.event_date_time);
        const endTime = new Date(d.getTime() + (60*60*1000));
        event.title = event.event_title;
        event.desc = event.event_details;
        event.start = d;
        event.end = event.event_end;
      })
      this.setState({ bandEvents: events });
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

  previewEvent = (event) => {
    this.setState({ currentEvent: event, previewEvent: true });
  }

  showModal = () => {
    this.setState({ displayModal: true });
  }

  addEvent = (evt) => {
    console.log('event', evt);
    this.setState({ eventPendingDate: evt }, () => {
      this.showModal();
    });
  }

  render() {

    console.log('STATE', this.state);

    let addButton;
    let createEventForm;

    if (this.state.bandInfoArr.length > 0) {

      createEventForm = this.props.loggedInUser.id === this.state.bandAdminId ?
      <EventCreator
        closeModal={this.closeModal}
        displayModal={this.state.displayModal}
        eventTypes={this.state.eventTypes}
        pendingDate={this.state.eventPendingDate}
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

    const currentEventDetails = this.state.currentEvent === null ? null :
    <div className="current-event-details">
      <h1>{this.state.currentEvent.event_title}</h1>
      <h2>{this.state.currentEvent.event_type}</h2>
      <p>{this.state.currentEvent.desc}</p>
      <p>{this.state.currentEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(this.state.currentEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      <p>{this.state.currentEvent.start.toLocaleDateString()}</p>
      <p>{this.state.currentEvent.event_city}</p>
      <p>{this.state.currentEvent.event_location}</p>
    </div>

    return (
      <div className="BandCalendar">
        <SideBar
          links={this.state.sideBarLinks}
          url={this.props.match.url}
        />
        {createEventForm}
        <BigCalendar
          selectable
          events={this.state.bandEvents}
          components={{
            agenda: {
              event: this.EventAgenda
            }
          }}
          defaultView='month'
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          eventPropGetter={this.eventStyle}
          style={{ height: '500px' }}
          onSelectEvent={event => this.previewEvent(event)}
          // onSelectSlot={(slotInfo) => alert(
          //   `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
          //   `\nend: ${slotInfo.end.toLocaleString()}` +
          //   `\naction: ${slotInfo.action}`
          // )}
          // onSelectSlot={(evt) => this.addEvent(evt)}
        />
        {addButton}
        {/* <div className="band-events">
          <h2>Gigs and Rehearsals {addButton}</h2>
          <EventList
            data={this.state.bandEvents}
            url="band_event"
          />
        </div> */}
        <Previewer
          closePreviewer={this.closePreviewer}
          display={this.state.previewEvent}
        >
          {currentEventDetails}
        </Previewer>
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
