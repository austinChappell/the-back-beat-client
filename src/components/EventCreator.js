import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

import Form from './Form';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import TextArea from './TextArea';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

const format = 'h:mm a';
const now = moment().hour(0).minute(0);

class EventCreator extends Component {

  state = {
    eventCity: '',
    eventDate: '',
    eventDetails: '',
    eventList: [],
    eventTime: '12:00 am',
    eventTitle: '',
    eventType: '',
    eventVenue: '',
    initialTimeVal: now,
    myEvents: [],
    startDate: moment(),
    unconvertedDate: ''
  }

  componentDidMount() {
    this.convertDate(this.state.startDate, this.state.eventTime);
    this.setState({ eventType: this.props.eventTypes[0].value })
  }

  handleInputChange = (evt, name) => {
    const newStateObj = {};
    newStateObj[name] = evt.target.value;
    this.setState(newStateObj);
  }

  convertDate = (date, time) => {
    console.log('TIME', time);
    const shortDate = date._d.toString().slice(0, 15);
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
    const url = `${apiURL}/${this.props.submitQuery}`
    console.log('URL', url);
    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        eventCity: this.state.eventCity,
        eventDateTime: this.state.eventDate + '+05',
        eventDetails: this.state.eventDetails,
        eventTitle: this.state.eventTitle,
        eventType: this.state.eventType,
        eventVenue: this.state.eventVenue,
        userCity: this.props.loggedInUser.city,
      })
    }).then((response) => {
      console.log('RESPONSE', response);
      return response.json();
    }).then((results) => {
      this.setState({
        eventDate: '',
        eventDetails: '',
        eventTime: '12:00am',
        eventTitle: '',
        eventType: this.props.eventTypes[0].value,
        eventVenue: '',
        initialTimeVal: now,
        startDate: moment()
      }, () => {
        this.convertDate(this.state.startDate);
        this.props.closeModal();
      })
    }).catch((err) => {
      throw err;
    })
  }

  render() {

    console.log('EVENT CREATOR STATE', this.state);

    return (
      <div className="EventCreator" style={{display: this.props.displayModal ? 'block' : 'none'}}>

        <div className="exit-button-div">
          <i
            id="exit-button"
            className="fa fa-times"
            onClick={this.props.exitClick}
            aria-hidden="true"></i>
        </div>

        <div className="event-form">

          <Form
            onSubmit={(evt) => this.submitForm(evt)}
            submitBtnText={`Add ${this.state.eventType}`}
            >

              <FormInput
                name="eventTitle"
                placeholder="Title"
                onChange={this.handleInputChange}
                type="text"
                value={this.state.eventTitle}
              />

              <div className="flex-calendar">

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

              </div>

              <TextArea
                name="eventDetails"
                placeholder="Description"
                charLimit={150}
                onChange={this.handleInputChange}
                value={this.state.eventDetails}
              />

              <FormSelect
                name="eventType"
                onChange={this.handleInputChange}
                options={this.props.eventTypes}
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

            </Form>

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

export default connect(mapStateToProps, mapDispatchToProps)(EventCreator);
