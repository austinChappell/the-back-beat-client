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

  state = {
    eventDate: '',
    eventTime: '',
    eventTitle: '',
    eventTypes: [
      { value: 'concert', text: 'Concert' },
      { value: 'jam session', text: 'Jam Session' },
      { value: 'rehearsal', text: 'Rehearsal' }
    ],
    eventType: '',
    eventVenue: '',
    startDate: moment()
  }

  componentDidMount() {
    this.convertDate(this.state.startDate);
  }

  handleInputChange = (evt, name) => {
    const newStateObj = {};
    newStateObj[name] = evt.target.value;
    this.setState(newStateObj);
  }

  convertDate = (date) => {
    const shortDate = date._d.toString().slice(0, 15);
    this.setState({ eventDate: shortDate });
  }

  handleDateChange = (date) => {
    this.setState({
      startDate: date
    }, () => {
      this.convertDate(this.state.startDate)
    });
  }

  onTimeChange = (value) => {
    const time = value && value.format(format);
    this.setState({ eventTime: time });
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
        eventVenue: this.state.eventVenu,
        eventDateTime: this.state.eventDate
      })
    }).then((response) => {
      console.log('WE MADE IT THIS FAR');
      return response.json();
    }).then((results) => {
      console.log('RESULTS', results.rows);
    }).then(() => {
      this.setState({
        eventDate: '',
        eventTime: '',
        eventTitle: '',
        eventTypes: [
          { value: 'concert', text: 'Concert' },
          { value: 'jam session', text: 'Jam Session' },
          { value: 'rehearsal', text: 'Rehearsal' }
        ],
        eventType: '',
        eventVenue: '',
        startDate: moment()
      })
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
            onChange={this.handleInputChange}
            type="text"
            value={this.state.eventVenue}
          />

          {/* // TODO: Make submit button and add functionality to post to database */}

        </Form>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage);
