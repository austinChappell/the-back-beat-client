import React, { Component } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Modal from './Modal';
import MusicianCarousel from './MusicianCarousel';
import TextArea from './TextArea';
import TextField from 'material-ui/TextField';

class BandPageBrowseMusicians extends Component {

  state = {
    bandInfo: {},
    displayModal: false,
    instruments: [],
    instrumentOptions: [],
    message: '',
    modalStage: 0,
    noResultsMsg: null,
    pendingInstrument: {},
    searchResults: [],
    showExitButton: true,
    skillIndexArray: [],
    sliderPosition: 0
  }

  componentWillMount() {

    // TODO: WE MIGHT NEED TO FIND A WAY FOR THE JS INSIDE DID MOUNT TO RUN AFTER THE SET STATE IN checkAuth()

    this.checkAuth();

  }

  fetchInstruments = () => {
    const url = this.props.apiURL;

    fetch(`${url}/api/instruments`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('INSTRUMENT RESULTS', results);
      this.setState({
        instrumentOptions: results.rows,
        pendingInstrument: {
          value: results.rows[0].name,
          id: results.rows[0].instrument_id
        }
      }, () => {
        console.log('STATE AFTER MOUNT', this.state);
        const bandInfo = this.state.bandInfo;
        let skillIndex;

        if (bandInfo.band_skill_level) {

          skillIndex = this.findSkillIndex();
          console.log('SKILL INDEX', skillIndex);
          let skillIndexArray;

          if (skillIndex === 0) {
            skillIndexArray = [skillIndex, skillIndex + 1];
          } else if (skillIndex === this.props.skillLevels.length - 1) {
            skillIndexArray = [skillIndex, skillIndex - 1];
          } else {
            skillIndexArray = [skillIndex, skillIndex + 1, skillIndex - 1];
          }

          console.log('SKILL INDEX ARRAY', skillIndexArray);

          this.setState({ skillIndexArray: skillIndexArray });

        }

      })
    })

  }

  checkAuth = () => {

    const url = this.props.apiURL;
    const bandId = this.props.match.params.bandId;

    fetch(`${url}/api/band/${bandId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bandInfo: results.rows[0] }, () => {
        this.fetchInstruments();
      });
    })

  }

  findSkillIndex = () => {
    return this.props.skillLevels.indexOf(this.state.bandInfo.band_skill_level);
  }

  fetchUsersByInstrumentId = (instrumentId) => {
    const url = this.props.apiURL;
    const city = this.state.bandInfo.band_city;
    let searchResults = [];
    let noResultsMsg;

    console.log('CHANGE FUNCTION RUNNING', instrumentId, this.state.skillIndexArray);
    this.state.skillIndexArray.forEach((skillIndex) => {

      const skillLevel = this.props.skillLevels[skillIndex];

      fetch(`${url}/api/users/instrumentid/${instrumentId}/city/${city}/skilllevel/${skillLevel}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((results) => {
        searchResults = searchResults.concat(results.rows);
        console.log('USER RESULTS', searchResults);

        if (searchResults.length === 0) {
          noResultsMsg = 'There are no musicians matching this criteria at this time.';
        } else {
          noResultsMsg = null;
        }
      }).then(() => {
        this.setState({ noResultsMsg, searchResults: searchResults, sliderPosition: 0 }, () => {
          console.log('CURRENT STATE', this.state);
        });
      })

    })

  }

  exitClick = () => {
    this.setState({ displayModal: false, message: '' });
  }

  filterSearch = (evt) => {
    if (evt.target.value !== '') {
      const instrumentId = evt.target.children[evt.target.selectedIndex].id;
      this.fetchUsersByInstrumentId(instrumentId);
    }
  }

  handleTextAreaChange = (evt, message) => {
    const value = evt.target.value;
    const updateObj = {};
    updateObj[message] = evt.target.value;
    this.setState(updateObj);
  }

  slideCarousel = (positionDiff) => {
    let newSliderPosition = this.state.sliderPosition + positionDiff;
    if (newSliderPosition <= 0 && newSliderPosition >= (this.state.searchResults.length - 1) * -100) {
      this.setState({ sliderPosition: newSliderPosition});
    }
  }

  handleMessageChange = (message) => {
    this.setState({ message });
  }

  sendMessage = (evt) => {
    evt.preventDefault();
    let message = this.state.message;
    let musicianIndex = Math.abs(this.state.sliderPosition / 100);
    let musician = this.state.searchResults[musicianIndex];
    const url = this.props.apiURL;
    fetch(`${url}/message/send`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        message,
        recipientId: musician.id,
        recipientFirstName: musician.first_name,
        recipientLastName: musician.last_name,
        recipientEmail: musician.email
      })
    }).then(() => {
      this.setState({ message: '', modalStage: 1, showExitButton: false }, () => {
        setTimeout(() => {
          this.setState({ displayModal: false, modalStage: 0, showExitButton: true });
        }, 2000);
      });
    })
  }

  writeMessage = () => {
    let musicianIndex = Math.abs(this.state.sliderPosition / 100);
    let musician = this.state.searchResults[musicianIndex];
    this.setState({ displayModal: true });
    console.log(musician);
  }

  render() {

    const bandInfo = this.state.bandInfo;
    let instrumentOptions;

    if (bandInfo.band_admin_id !== undefined && bandInfo.band_admin_id != this.props.match.params.adminId) {
      this.props.history.goBack();
    }

    if (this.props.loggedInUser.id != this.props.match.params.adminId) {
      this.props.history.goBack();
    }

    if (this.state.instrumentOptions.length > 0) {
      instrumentOptions = this.state.instrumentOptions.map((option) => {
        return (
          <option key={option.instrument_id} id={option.instrument_id} value={option.name}>{option.name}</option>
        )
      })
    }

    let modalContent;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.exitClick}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={(evt) => this.sendMessage(evt)}
      />,
    ];

    switch(this.state.modalStage) {
      case 0:
        modalContent = <div>
          {/* <TextArea
            name="message"
            placeholder="Send a message..."
            onChange={this.handleTextAreaChange}
            rows="10"
            value={this.state.message}
          />
          <button onClick={(evt) => this.sendMessage(evt)}>Send Message</button> */}
          <TextField
            className="message-input"
            multiLine={true}
            rows={1}
            rowsMax={4}
            floatingLabelText="Your Message"
            floatingLabelStyle={{textAlign: 'left'}}
            onChange={(evt) => this.handleMessageChange(evt.target.value)}
            value={this.state.message}
          />
        </div>
        break;
      case 1:
        modalContent = <div className="message-confirm-modal">
          <h1>Message Sent!</h1>
          <i className="fa fa-check message-sent-check" aria-hidden="true"></i>
        </div>
        break;
      default:
        modalContent = null;
    }

    return (

      <div className="BandPageBrowseMusicians">
        <h1>Search for musicians in {bandInfo.band_city} to join {bandInfo.band_name}.</h1>

        <label>Filter by instrument:</label>
        <select onChange={(evt) => this.filterSearch(evt)}>
          <option value="">---</option>
          {instrumentOptions}
        </select>

        <MusicianCarousel
          noResultsMsg={this.state.noResultsMsg}
          searchResults={this.state.searchResults}
          sliderPosition={this.state.sliderPosition}
          slideCarousel={this.slideCarousel}
          writeMessage={this.writeMessage}
        />

        {/* <Modal displayModal={this.state.displayModal} exitClick={this.exitClick} showExitButton={this.state.showExitButton}> */}

          <Dialog
            modal={false}
            actions={this.state.message != '' ? actions : null}
            open={this.state.displayModal}
            onRequestClose={this.exitClick}
            style={{textAlign: 'center'}}
          >

          {modalContent}

        </Dialog>

        {/* </Modal> */}

      </div>

    )

  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser,
    skillLevels: state.skillLevels
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandPageBrowseMusicians);
