import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

import Form from './Form';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

const format = 'h:mm a';
const now = moment().hour(0).minute(0);

class CalendarPage extends Component {

  // TODO: Work on fixing time value

  state = {
    eventCity: '',
    eventDate: '',
    eventTime: '12:00 am',
    eventTitle: '',
    eventTypes: [
      { value: 'concert', text: 'Concert' },
      { value: 'Jam Session', text: 'Jam Session' },
      { value: 'Rehearsal', text: 'Rehearsal' }
    ],
    eventType: '',
    eventVenue: '',
    initialTimeVal: now,
    startDate: moment(),
    unconvertedDate: ''
  }

  componentDidMount() {
    this.convertDate(this.state.startDate, this.state.eventTime);
    this.setState({ eventType: this.state.eventTypes[0].value })
  }

  handleInputChange = (evt, name) => {
    const newStateObj = {};
    newStateObj[name] = evt.target.value;
    this.setState(newStateObj, () => {
      console.log('STATE', this.state);
    });
  }

  convertDate = (date, time) => {
    const shortDate = date._d.toString().slice(0, 15);
    this.setState({ eventDate: shortDate + ' ' + time }, () => {
      console.log('CONVERT DATE', this.state);
    });
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
    console.log('SUBMIT FUNCTION RUNNING');
    const apiURL = this.props.apiURL;
    console.log('API URL', apiURL);
    fetch(`${apiURL}/api/calendar/add`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        eventTitle: this.state.eventTitle,
        eventType: this.state.eventType,
        eventVenue: this.state.eventVenue,
        eventDateTime: this.state.eventDate,
        eventCity: this.state.eventCity,
        userCity: this.props.loggedInUser.city,
      })
    }).then((response) => {
      console.log('WE MADE IT THIS FAR');
      return response.json();
    }).then((results) => {
      console.log('RESULTS', results.rows);
    }).then(() => {
      this.setState({
        eventDate: '',
        eventTime: '12:00am',
        eventTitle: '',
        eventTypes: [
          { value: 'concert', text: 'Concert' },
          { value: 'Jam Session', text: 'Jam Session' },
          { value: 'Rehearsal', text: 'Rehearsal' }
        ],
        eventType: this.state.eventTypes[0].value,
        eventVenue: '',
        initialTimeVal: now,
        startDate: moment()
      }, () => {
        this.convertDate(this.state.startDate);
      })
    }).catch((err) => {
      console.log('FAILED', err);
    })
  }

  render() {

    if (this.state.eventDate !== null) {
      console.log('DATE IS', this.state.eventDate);
    }

    return (
      <div className="CalendarPage">

        <Form
          onSubmit={(evt) => this.submitForm(evt)}
          submitBtnText="Add To Calendar"
        >

          <FormInput
            name="eventTitle"
            placeholder="Title"
            onChange={this.handleInputChange}
            type="text"
            value={this.state.eventTitle}
          />

          <DatePicker
            name="selectedDate"
            onChange={this.handleDateChange}
            selected={this.state.startDate}
          />

          <TimePicker
            showSecond={false}
            defaultValue={now}
            className="xxx"
            onChange={this.onTimeChange}
            format={format}
            use12Hours
          />

          <FormSelect
            name="eventType"
            onChange={this.handleInputChange}
            options={this.state.eventTypes}
            value={this.state.eventTypeSelected}
          />

          <FormInput
            name="eventVenue"
            placeholder="Venue"
            onChange={this.handleInputChange}
            type="text"
            value={this.state.eventVenue}
          />

          <FormInput
            name="eventCity"
            placeholder="City"
            onChange={this.handleInputChange}
            type="text"
            value={this.state.eventCity}
          />

          {/* // TODO: Make submit button and add functionality to post to database */}

        </Form>

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
