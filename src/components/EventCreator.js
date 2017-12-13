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
    eventDuration: 2,
    eventList: [],
    eventTime: '12:00 am',
    eventTitle: '',
    eventType: '',
    eventTypeSelected: null,
    eventVenue: '',
    initialTimeVal: now,
    myEvents: [],
    open: false,
    startDate: moment(),
    unconvertedDate: ''
  }

  // TODO: Add the ability to set event duration and integrate add to calendar feature

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

    let stringDate = this.state.eventDate;
    let stringTime = this.state.eventTime;

    let shortDate = stringDate.slice(0, 15);
    let shortTime = stringTime.slice(16, stringTime.length);
    let stringDateTime = `${shortDate} ${shortTime}`;
    let date = new Date(stringDateTime);
    const end = new Date(date.getTime() + 60000 * 60 * this.state.eventDuration);

    console.log('start date', date);
    console.log('end date', end);

    fetch(`${url}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'POST',
      body: JSON.stringify({
        eventCity: this.state.eventCity,
        eventDateTime: date,
        eventDetails: this.state.eventDetails,
        eventEnd: end,
        eventTitle: this.state.eventTitle,
        eventType: this.state.eventTypeSelected,
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
        eventTypeSelected: null,
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

  initialize = () => {
    const mapOptions = {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      scrollwheel: false
    };
    const map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

    const input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));

      // Create the autocomplete helper, and associate it with
      // an HTML text input box.
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      const infowindow = new google.maps.InfoWindow();
      const marker = new google.maps.Marker({
        map: map
      });
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });

      // Get the full place details when the user selects a place from the
      // list of suggestions.
      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        infowindow.close();
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }

        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }

        // Set the position of the marker using the place ID and location.
        marker.setPlace(/** @type {!google.maps.Place} */ ({
          placeId: place.place_id,
          location: place.geometry.location
        }));
        marker.setVisible(true);

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        'Place ID: ' + place.place_id + '<br>' +
        place.formatted_address + '</div>');
        infowindow.open(map, marker);
      });
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
  };

  handleSelectChange = (evt, index, value) => {
    console.log(value);
    this.setState({ eventTypeSelected: value });
  }

  render() {

    console.log('EVENT CREATOR STATE', this.state);
    console.log('EVENT CREATOR PROPS', this.props);

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

    return (
      <div className="EventCreator">

        <div className="event-form">

            <Dialog
              title="Create An Event"
              actions={actions}
              modal={false}
              open={this.props.displayModal}
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
                  firstDayOfWeek={0}
                  DatePicker={DatePickerDialog}
                  TimePicker={TimePickerDialog}
                />

                <TimePicker
                  format="ampm"
                  floatingLabelText="Event Time"
                  onChange={this.handleNewTimeChange}
                />

                <TextField
                  floatingLabelText="Duration (hrs)"
                  onChange={(evt) => this.handleChange(evt, 'eventDuration')}
                  min={0}
                  max={24}
                  step={0.5}
                  type="number"
                  value={this.state.eventDuration}
                />

                <SelectField
                  floatingLabelText="Type"
                  value={this.state.eventTypeSelected}
                  onChange={this.handleSelectChange}
                >
                  {this.props.eventTypes.map((eventType, index) => {
                    return (
                      <MenuItem
                        key={index}
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
