import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import Form from './Form';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

import 'react-datepicker/dist/react-datepicker.css';

class CalendarPage extends Component {

  state = {
    eventTitle: 'Hi there',
    eventTypes: [
      { value: 'concert', text: 'Concert' },
      { value: 'jam session', text: 'Jam Session' },
      { value: 'rehearsal', text: 'Rehearsal' }
    ],
    eventTypeSelected: 'rehearsal',
    eventVenue: '',
    startDate: moment()
  }

  handleInputChange = (evt, name) => {
    const newStateObj = {};
    newStateObj[name] = evt.target.value;
    this.setState(newStateObj, () => {
      console.log('INPUT CHANGED', this.state);
    });
  }

  handleDateChange = (date) => {
    this.setState({
      startDate: date
    });
  }

  render() {
    return (
      <div className="CalendarPage">

        <Form>

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
            showTimeSelect
            dateFormat="LLL"
          />

          <FormSelect
            name="eventTypeSelected"
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

        </Form>

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

export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage);
