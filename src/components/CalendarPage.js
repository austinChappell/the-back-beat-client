import React, { Component } from 'react';
import { connect } from 'react-redux';
// import DatePicker from 'react-datepicker';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
// import TimePicker from 'rc-time-picker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';

import EventList from './EventList';
import Form from './Form';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import TextArea from './TextArea';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

const format = 'h:mm a';
const now = moment().hour(0).minute(0);

class CalendarPage extends Component {

  // TODO: Work on fixing time value

  state = {
    eventCity: '',
    eventDate: '',
    eventDetails: '',
    eventList: [],
    eventTime: '12:00 am',
    eventTitle: '',
    eventTypes: [
      { value: 'Concert', text: 'Concert' },
      { value: 'Jam Session', text: 'Jam Session' },
    ],
    eventType: '',
    eventTypeSelected: null,
    eventVenue: '',
    open: false,
    initialTimeVal: now,
    myEvents: [],
    startDate: moment(),
    unconvertedDate: ''
  }

  componentDidMount() {
    this.convertDate(this.state.startDate, this.state.eventTime);
    this.fetchUserEvents();
    this.setState({ eventType: this.state.eventTypes[0].value })
  }

  fetchUserEvents = () => {
    const url = this.props.apiURL;
    const userid = this.props.loggedInUser.id
    console.log('FETCING USER EVENTS', url, userid);
    fetch(`${url}/api/events/attending/${userid}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log('RESPONSE', response);
      return response.json();
    }).then((results) => {
      console.log('RESULTS', results);
      this.setState({ myEvents: results.rows }, () => {
        this.state.myEvents.map((event) => {
          this.fetchEventDetails(event.event_id);
        })
      });
    })
  }

  fetchEventDetails = (id) => {
    const url = this.props.apiURL;
    fetch(`${url}/api/event/${id}/details`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ eventList: this.state.eventList.concat(results.rows) });
    })
  }

  handleInputChange = (evt, name) => {
    const newStateObj = {};
    newStateObj[name] = evt.target.value;
    this.setState(newStateObj);
  }

  convertDate = (date, time) => {
    const shortDate = date.toString().slice(0, 15);
    this.setState({ eventDate: shortDate + ' ' + time });
  }

  handleDateChange = (date) => {
    this.setState({
      startDate: date
    }, () => {
      this.convertDate(this.state.startDate, this.state.eventTime)
    });
  }

  onTimeChange = (value) => {
    const time = value && value.format(format);
    this.setState({ eventTime: time }, () => {
      this.convertDate(this.state.startDate, time);
    });
  }

  submitForm = (evt) => {
    evt.preventDefault();
    const apiURL = this.props.apiURL;
    console.log('STATE', this.state);
    console.log('CITY', this.props.loggedInUser.city);


    let stringDate = this.state.eventDate;
    let stringTime = this.state.eventTime;

    let shortDate = stringDate.slice(0, 15);
    let shortTime = stringTime.slice(16, stringTime.length);
    let stringDateTime = `${shortDate} ${shortTime}`;
    let date = new Date(stringDateTime);

    fetch(`${apiURL}/api/calendar/add`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        eventTitle: this.state.eventTitle,
        eventType: this.state.eventTypeSelected,
        eventVenue: this.state.eventVenue,
        eventDateTime: date,
        eventDetails: this.state.eventDetails,
        eventCity: this.state.eventCity,
        userCity: this.props.loggedInUser.city,
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({
        eventDate: '',
        eventDetails: '',
        eventTime: '12:00am',
        eventTitle: '',
        eventType: this.state.eventTypes[0].value,
        eventVenue: '',
        initialTimeVal: now,
        startDate: moment()
      }, () => {
        this.convertDate(this.state.startDate);
        this.props.history.push('/');
      })
    }).catch((err) => {
      throw err;
    })
  }

  handleNewDateChange = (evt, date) => {
    this.setState({
      startDate: date
    }, () => {
      this.convertDate(this.state.startDate, this.state.eventTime)
    });
  }

  handleNewTimeChange = (evt, time) => {
    let stringTime = String(time);
    this.setState({eventTime: stringTime}, () => {

    });
  }

  handleChange = (evt, name) => {
    const updateObj = {};
    updateObj[name] = evt.target.value;
    this.setState(updateObj);
  }

  handleSelectChange = (evt, index, value) => {
    console.log(value);
    this.setState({ eventTypeSelected: value });
  }

  setDate = (dateTime) => {
    console.log('SET DATE RUNNING');
    this.setState({ dateTime });
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = (submit) => {
    this.setState({open: false});
    if (submit) {
      console.log('true');
    } else {
      console.log('false');
    }
  };

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.handleClose(false)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={(evt) => this.submitForm(evt)}
      />,
    ];

    console.log('STATE', this.state);

    return (
      <div className="CalendarPage">

        <FloatingActionButton
          secondary={true}
          onClick={this.handleOpen}
        >
          <ContentAdd />
        </FloatingActionButton>

        <Dialog
          title="Create An Event"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >

          <div className="form-inputs">


            <TextField
              floatingLabelText="Title"
              onChange={(evt) => this.handleChange(evt, 'eventTitle')}
              value={this.state.eventTitle}
            />

            <TextField
              floatingLabelText="Details"
              onChange={(evt) => this.handleChange(evt, 'eventDetails')}
              multiLine={true}
              rows={1}
              rowsMax={4}
            />

            <DatePicker
              onChange={this.handleNewDateChange}
              floatingLabelText="Event Date"
              DatePicker={DatePickerDialog}
              TimePicker={TimePickerDialog}
            />

            <TimePicker
              format="ampm"
              floatingLabelText="Event Time"
              onChange={this.handleNewTimeChange}
            />

            <SelectField
              floatingLabelText="Type"
              value={this.state.eventTypeSelected}
              onChange={this.handleSelectChange}
            >
              {this.state.eventTypes.map((eventType) => {
                return (
                  <MenuItem
                    value={eventType.value}
                    primaryText={eventType.text}
                  />
                )
              })}
            </SelectField>

            <TextField
              floatingLabelText="Venue"
              onChange={(evt) => this.handleChange(evt, 'eventVenue')}
            />

            <TextField
              floatingLabelText="City"
              onChange={(evt) => this.handleChange(evt, 'eventCity')}
            />

          </div>

        </Dialog>

        <EventList
          attendanceButtons={true}
          data={this.state.eventList}
          title="Events You Are Attending"
          url="event"
        />

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

export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage);
