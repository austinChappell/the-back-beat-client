import React, { Component } from 'react';
import { connect } from 'react-redux';
// import DatePicker from 'react-datepicker';
import moment from 'moment';
// import TimePicker from 'rc-time-picker';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import Form from './Form';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import TextArea from './TextArea';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

const format = 'h:mm a';
const now = moment().hour(0).minute(0);

class EventCreator extends Component {

  state = {
    eventCity: '',
    eventDate: '',
    eventDetails: '',
    eventDuration: null,
    eventList: [],
    eventTime: '12:00 am',
    eventTitle: '',
    eventType: '',
    eventVenue: '',
    initialTimeVal: now,
    myEvents: [],
    open: false,
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
        eventDateTime: `${this.state.eventDate}-05`,
        eventDetails: this.state.eventDetails,
        eventDuration: Number(this.state.eventDuration),
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
        eventDuration: null,
        eventTime: '12:00am',
        eventTitle: '',
        eventType: this.props.eventTypes[0].value,
        eventVenue: '',
        initialTimeVal: now,
        startDate: moment()
      }, () => {
        this.convertDate(this.state.startDate);
        this.props.closeModal();
        this.props.history.push('/');
      })
    }).catch((err) => {
      throw err;
    })
  }

  handleChange = (evt, name) => {
    const updateObj = {};
    updateObj[name] = evt.target.value;
    this.setState(updateObj);
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = (submit) => {
    this.props.closeModal();
    // this.setState({open: false});
    // if (submit) {
    //   console.log('true');
    // } else {
    //   console.log('false');
    // }
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
      <div className="EventCreator">

        {/* <div className="exit-button-div">
          <i
            id="exit-button"
            className="fa fa-times"
            onClick={this.props.exitClick}
            aria-hidden="true"></i>
        </div>
 */}
        <div className="event-form">

          {/* <Form
            onSubmit={(evt) => this.submitForm(evt)}
            submitBtnText={`Add ${this.state.eventType}`}
            > */}

            <Dialog
              title="Create An Event"
              actions={actions}
              modal={false}
              open={this.props.displayModal}
              onRequestClose={this.handleClose}
            >

              <div className="form-inputs">

                {/* <FormInput
                  name="eventTitle"
                  placeholder="Title"
                  onChange={this.handleInputChange}
                  type="text"
                  value={this.state.eventTitle}
                /> */}

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



                {/* <DatePicker
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
                /> */}

                {/* <FormInput
                  name="eventDuration"
                  placeholder="Event Duration (in hours)"
                  step={1}
                  min={1}
                  max={12}
                  onChange={this.handleInputChange}
                  type="number"
                  value={this.state.eventDuration}
                /> */}

                {/* <TextArea
                  name="eventDetails"
                  placeholder="Description"
                  charLimit={150}
                  onChange={this.handleInputChange}
                  value={this.state.eventDetails}
                /> */}

                <SelectField
                  floatingLabelText="Type"
                  value={this.state.eventTypeSelected}
                  onChange={this.handleSelecteChange}
                >
                  {this.props.eventTypes.map((eventType) => {
                    return (
                      <MenuItem
                        value={eventType.value}
                        primaryText={eventType.text}
                      />
                    )
                  })}
                </SelectField>

{/*
                <FormSelect
                  name="eventType"
                  onChange={this.handleInputChange}
                  options={this.props.eventTypes}
                  value={this.state.eventTypeSelected}
                /> */}

                <TextField
                  floatingLabelText="Venue"
                  onChange={(evt) => this.handleChange(evt, 'eventVenue')}
                />

                <TextField
                  floatingLabelText="City"
                  onChange={(evt) => this.handleChange(evt, 'eventCity')}
                />


                {/* <FormInput
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
                /> */}

              </div>

            </Dialog>

            {/* </Form> */}

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
