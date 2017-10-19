import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from './Modal';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

class OnboardingForm extends Component {

  constructor() {
    super();

    this.state = {
      displayModal: true,
      errorMessage: null,
      genreOptions: [],
      pendingGenre: '',
      selectedGenres: [],
      selectedGenreMax: 5,
      selectedGenreMin: 3,
      instrumentOptions: [],
      pendingInstrument: '',
      selectedInstruments: [],
      selectedInstrumentMax: 3,
      selectedInstrumentMin: 1,
      seekingInstrumentMax: 3,
      seekingInstrumentMin: 0,
      showExitButton: false,
      pendingVideo: '',
      pendingVideoTitle: '',
      pendingVideoDescription: '',
      selectedVideos: [],
      primaryVidIndex: 0,
      videoMin: 0,
      videoMax: 10
    }
  }

  componentDidMount() {

    const url = this.props.apiURL;
    fetch(`${url}/api/genres`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log(results.rows);
      this.setState({
        genreOptions: results.rows,
        pendingGenre: {
          value: results.rows[0].style_name,
          id: results.rows[0].style_id
        },
      })
    });

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
      })
    })

    console.log('USER', this.props.loggedInUser);

    setTimeout(() => {
      this.getOnboardingStage();
    }, 250);
  }

  getOnboardingStage = () => {
    console.log('GET ONBOARDING STAGE');
    if (this.props.loggedInUser.onboarding_stage !== undefined) {
      console.log('SUCCESS', this.props.loggedInUser.onboarding_stage);
      this.props.updateOnboardingStage(this.props.loggedInUser.onboarding_stage);
    } else {
      console.log('FAILURE');
      setTimeout(() => {
        this.getOnboardingStage();
      }, 100);
    }
  }

  handleChange = (evt, category, selected, max, tempIndex) => {
    const updateState = {};
    updateState[category] = {
      id: evt.target.children[evt.target.selectedIndex].id,
      value: evt.target.value,
      tempIndex
    };
    this.setState(updateState, () => {
      this.handleSubmit(selected, category, max, tempIndex);
    });
  }

  handleInputChange = (evt, category) => {
    if (this.state.errorMessage) {
      this.setState({ errorMessage: null });
    }
    const updateState = {};
    updateState[category] = evt.target.value;
    this.setState(updateState);
  }

  handleRadioChange = (evt, index) => {
    let newVidArray = this.state.selectedVideos.slice();
    for (let i = 0; i < newVidArray.length; i++) {
      if (index === i) {
        newVidArray[i].set_as_primary = true;
      } else {
        newVidArray[i].set_as_primary = false;
      }
    }
    this.setState({ primaryVidIndex: index, selectedVideos: newVidArray }, () => {
      console.log('STATE', this.state);
    });
  }

  handleSubmit = (array, element, max, index) => {
    // evt.preventDefault();
    const updateState = {};
    updateState.errorMessage = null;
    updateState[array] = this.state[array].slice();
    // PREVENT DUPLICATES IN THE ARRAY AND DO NOT ALLOW THE ARRAY TO EXCEED 5 ELEMENTS
    if (updateState[array].length < max) {
      updateState[array][index] = (this.state[element]);
    }
    this.setState(updateState, () => {
      console.log(this.state);
      for (let i = 0; i < this.state[array].length; i++) {
        for (let j = 0; j < this.state[array].length; j++) {
          if (this.state[array][i] !== undefined && this.state[array][j] !== undefined) {
            if (this.state[array][i].id === this.state[array][j].id && i !== j) {
              this.setState({
                errorMessage: 'You may not select the same item more than once'
              })
            }
          }
        }
      }
    });
  }

  handleVidLinkSubmit = (evt, array, url, title, description) => {
    evt.preventDefault();
    if (this.state.pendingVideo != false && this.state.pendingVideoTitle != false && this.state.pendingVideoDescription != false) {
      const updateState = {};
      const updateArray = this.state[array].slice();

      function getYouTubeId (videoURL) {

        let queryIndex = videoURL.indexOf('?v=');
        let vidID = videoURL.slice(queryIndex + 3, videoURL.length);
        return vidID;

      }

      let vidID = getYouTubeId(this.state[url]);

      updateArray.push({
        set_as_primary: false,
        video_description: this.state[description],
        video_title: this.state[title],
        youtube_id: vidID
      });
      updateState[array] = updateArray;
      updateState[url] = '';
      updateState[title] = '';
      updateState[description] = '';
      this.setState(updateState, () => {
        console.log('STATE', this.state);
      });
    } else {
      this.setState({
        errorMessage: 'You must complete all fields before adding a video'
      })
    }
  }

  removeItem = (arrayName, index) => {
    const updateObject = {};
    let newArray = this.state[arrayName].slice();
    newArray.splice(index, 1);
    updateObject[arrayName] = newArray;
    this.setState(updateObject);
  }

  addPrimaryToUser = (videoId) => {
    const url = this.props.apiURL;
    console.log('ADD PRIMARY TO USER FUNCTION', videoId);

    fetch(`${url}/api/user/vidprimary/${videoId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('PRIMARY VID RESULTS', results.rows);
    })

    // TODO: Add API to add primary vid ID to user


  }

  getMusicians = (user, styleids) => {

    const skillLevels = this.props.skillLevels;

    const apiURL = this.props.apiURL;
    const userSkillIndex = skillLevels.indexOf(user.skill_level);
    let skill_level_one = skillLevels[userSkillIndex - 1];
    let skill_level_two = skillLevels[userSkillIndex];
    let skill_level_three = skillLevels[userSkillIndex + 1];
    let styleidone = styleids[0];
    let styleidtwo = styleids[1];
    let styleidthree = styleids[2];

    if (userSkillIndex === 0) {

      skill_level_one = 'no_skill';
    }

    if (userSkillIndex === skillLevels.length - 1) {
      skill_level_three = 'no_skill';
    }

    // const urlone = `${apiURL}/api/users/city/${user.city}/skill_level_one/${skill_level_one}/skill_level_two/${skill_level_two}/skill_level_three/${skill_level_three}`;

    const url = `${apiURL}/api/users/styleidone/${styleidone}/styleidtwo/${styleidtwo}/styleidthree/${styleidthree}/city/${user.city}/skill_level_one/${skill_level_one}/skill_level_two/${skill_level_two}/skill_level_three/${skill_level_three}`;

    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {

      function randomize (arr) {
        const newArray = [];

        while (arr.length > 0) {
          let randomNum = Math.random() * arr.length;
          let item = arr.splice(randomNum, 1);
          newArray.push(item[0]);
        }

        return newArray;
      }

      let randomResults = randomize(results.rows);
      let limitedResults = randomResults.splice(0, 25);

      this.props.getMusicians(limitedResults);
    });

  }

  getUserStyles = (loggedInUser) => {
    const apiURL = this.props.apiURL;
    fetch(`${apiURL}/api/user/styles`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      const styles = [];
      results.rows.forEach((style) => {
        styles.push(style.style_id);
      });
      console.log('STYLES', styles);
      this.getMusicians(loggedInUser, styles);
    })
  }

  continue = (evt, onboardingCategory, max, min, query) => {
    evt.preventDefault();
    if (this.props.onboardingStage > 1) {
      this.getUserStyles(this.props.loggedInUser);
    }
    if (this.state[onboardingCategory].length >= min && this.state[onboardingCategory].length <= max) {
      const url = this.props.apiURL;

      this.state[onboardingCategory].forEach((item) => {

        fetch(`${url}/api/${query}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item: item
          }),
          method: 'POST'
        }).then((response) => {
          return response.json();
        }).then((results) => {
          console.log('RESULTS', results);
          // If statement for checking if result is set as primary goes here. If it is, add it to the user in backbeatuser.
          if (results.rows[0].set_as_primary) {
            this.addPrimaryToUser(results.rows[0].youtube_id);
          }
        })

      })

      fetch(`${url}/user/onboarding/plus`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }).then((response) => {
        return response.json();
      }).then((results) => {
        console.log(results);
        this.props.updateOnboardingStage(results.rows[0].onboarding_stage);
        const updateState = {};
        updateState[onboardingCategory] = [];
        this.setState(updateState);
      })

    } else {
      this.setState({
        errorMessage: `You must select ${min} to ${max} items.`
      })
    }
  }

  render() {

    let actions = [
      <FlatButton
        label="Submit"
        primary={true}
        onClick={(evt) => {
          this.submitForm(evt, this.props.userInfo);
        }}
      />,
    ];

    if (this.state.selectedVideos.length === 1 && this.state.primaryVidIndex !== 0) {
      this.setState({ primaryVidIndex: 0 });
    }

    if (this.state.selectedVideos.length === 1 && this.state.selectedVideos[0].set_as_primary !== true) {
      let primaryVid = this.state.selectedVideos[0];
      primaryVid.set_as_primary = true;
      this.setState({ selectedInstruments: [primaryVid] });
    }

    console.log('PRIMARY VIDEO INDEX', this.state);

    let stage = this.props.onboardingStage;
    if (stage === null && this.props.loggedInUser) {
      this.updateOnboardingStage(this.props.loggedInUser);
    }
    let form;
    let genreOptions;
    let instrumentOptions;

    if (this.state.genreOptions.length > 0) {
      genreOptions = this.state.genreOptions.map((option) => {
        return (
          <option key={option.style_id} id={option.style_id} value={option.style_name}>{option.style_name}</option>
        )
      })
    }

    if (this.state.instrumentOptions.length > 0) {
      instrumentOptions = this.state.instrumentOptions.map((option) => {
        return (
          <option key={option.instrument_id} id={option.instrument_id} value={option.name}>{option.name}</option>
        )
      })
    }

    let errorMessage = this.state.errorMessage ?
      <p className="error-message">
        {this.state.errorMessage}
      </p>
      :
      null;

    if (stage === 0) {

      const selectArray = [];
      for (let i = 0; i < this.state.selectedGenreMax; i++) {
          let selectItem = <select onChange={(evt) => this.handleChange(evt, 'pendingGenre', 'selectedGenres', this.state.selectedGenreMax, i)}>
            <option value=''>Select Genre</option>
            {genreOptions}
          </select>
          selectArray.push(selectItem);
      }

      actions = [
        <FlatButton
          label="Continue"
          primary={true}
          onClick={(evt) => {
            this.continue(evt, 'selectedGenres', this.state.selectedGenreMax, this.state.selectedGenreMin, 'genres/add', true)
          }}
        />,
      ];

      form = <div>
        <h1>What genres do you listen to/play?</h1>
        <span>Choose 3-5 genres</span>
        <form style={{marginTop: '20px'}}>
          {selectArray.map((item) => {
            return item;
          })}
        </form>

        {errorMessage}

      </div>

    } else if (stage === 1) {

      const selectArray = [];
      for (let i = 0; i < this.state.selectedInstrumentMax; i++) {
          let selectItem = <select onChange={(evt) => this.handleChange(evt, 'pendingInstrument', 'selectedInstruments', this.state.selectedInstrumentMax, i)}>
            <option value='' selected>Select Instrument</option>
            {instrumentOptions}
          </select>
          selectArray.push(selectItem);
      }

      actions = [
        <FlatButton
          label="Continue"
          primary={true}
          onClick={(evt) => {
            this.continue(evt, 'selectedInstruments', this.state.selectedInstrumentMax, this.state.selectedInstrumentMin, 'instruments/add', true)
          }}
        />,
      ];

      form = <div>
        <h1>Choose your instrument(s).</h1>
        <span>Choose 1-3 instruments</span>
        <form style={{marginTop: '20px'}}>
          {selectArray.map((item) => {
            return item;
          })}
        </form>

        {errorMessage}

      </div>

    } else if (stage == 2) {

      let videoListTitle = null;

      if (this.state.selectedVideos.length > 0) {
        videoListTitle = <div className="video-list-title">
          <div className="vid-primary-header">
            Primary
          </div>
          <div className="vid-title-header">
            Title
          </div>
          <div className="vid-remove-header">
            Remove
          </div>
        </div>
      }

      actions = [
        <FlatButton
          label={this.state.selectedVideos.length > 0 ? 'Continue' : 'I\'ll do this later'}
          primary={true}
          onClick={(evt) => {
            this.continue(evt, 'selectedVideos', this.state.videoMax, this.state.videoMin, 'user/vids', this.state.selectedVideos.length > 0);
          }}
        />,
      ];

      form = <div className="video-modal">
        <h1>Add Videos</h1>
        <h3>Upload videos of yourself playing. Choose one as the primary, and make a great first impression!</h3>
        <form className="flex-form">
          <i
            className="fa fa-plus add-video-button"
            onClick={(evt) => {this.handleVidLinkSubmit(evt, 'selectedVideos', 'pendingVideo', 'pendingVideoTitle', 'pendingVideoDescription')}}
            aria-hidden="true"></i>
          <div className="vid-form">
            <div className="flex-inputs">
              <input
                onChange={(evt) => this.handleInputChange(evt, 'pendingVideo')}
                placeholder="YouTube Link"
                value={this.state.pendingVideo}
              />
              <input
                onChange={(evt) => this.handleInputChange(evt, 'pendingVideoTitle')}
                placeholder="Video Title"
                value={this.state.pendingVideoTitle}
              />
            </div>
            <input
              className="half-width-input"
              onChange={(evt) => this.handleInputChange(evt, 'pendingVideoDescription')}
              placeholder="Video Description"
              value={this.state.pendingVideoDescription}
            />
          </div>
        </form>
        {videoListTitle}
        {this.state.selectedVideos.map((video, index) => {
          return (
            <div key={index} className="added-videos">
              <input
                type="radio"
                checked={index === this.state.primaryVidIndex || this.state.selectedVideos.length === 1}
                onClick={(evt) => this.handleRadioChange(evt, index)}
              />
              <h3 style={{ display: 'inline-block' }}>{video.video_title}</h3>
              <i
                className="fa fa-times-circle remove-button"
                aria-hidden="true"
                onClick={() => this.removeItem('selectedVideos', index)}
              ></i>
            </div>
          )
        })}
        {errorMessage}
      </div>

    }

    return (
      <div className="OnboardingForm">

        <Dialog
          modal={false}
          actions={actions}
          open={true}
          onRequestClose={this.exitForm}
        >

          {form}

        </Dialog>

      </div>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser,
    skillLevels: state.skillLevels,
    onboardingMaxStage: state.onboardingMaxStage,
    onboardingReqMaxStage: state.onboardingReqMaxStage,
    onboardingStage: state.onboardingStage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    getMusicians: (data) => {
      const action = { type: 'GET_COMPATIBLE_MUSICIANS', data };
      dispatch(action);
    },

    updateOnboardingStage: (stage) => {
      const action = {type: 'UPDATE_ONBOARDING_STAGE', stage};
      dispatch(action);
    }

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OnboardingForm);
