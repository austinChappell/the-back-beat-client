import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from './Modal';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class OnboardingForm extends Component {

  constructor() {
    super();

    this.state = {
      displayModal: true,
      errorMessage: null,
      genreOptions: [],
      genreSelect: [],
      pendingGenre: '',
      selectedGenres: [],
      selectedGenreMax: 5,
      selectedGenreMin: 3,
      instrumentOptions: [],
      instrumentSelect: [],
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
      videoMax: 3
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
      this.setState({
        instrumentOptions: results.rows,
        pendingInstrument: {
          value: results.rows[0].name,
          id: results.rows[0].instrument_id
        }
      })
    })

    setTimeout(() => {
      this.getOnboardingStage();
    }, 250);
  }

  getOnboardingStage = () => {
    if (this.props.loggedInUser.onboarding_stage !== undefined) {
      this.props.updateOnboardingStage(this.props.loggedInUser.onboarding_stage);
    } else {
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
    });
  }

  handleSubmit = (array, element, max, index) => {
    const updateState = {};
    updateState.errorMessage = null;
    updateState[array] = this.state[array].slice();
    // PREVENT DUPLICATES IN THE ARRAY AND DO NOT ALLOW THE ARRAY TO EXCEED 5 ELEMENTS
    if (updateState[array].length <= max) {
      updateState[array][index] = (this.state[element]);
    }
    this.setState(updateState, () => {
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
    let errorMessage;
    if (this.state.pendingVideo != false && this.state.pendingVideoTitle != false && this.state.pendingVideoDescription != false) {
      if (this.state.selectedVideos.length >= this.state.videoMax) {
        errorMessage = 'You may only submit three videos';
      } else {
        errorMessage = null;
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
        this.setState(updateState);
      }
    } else {
      errorMessage = 'You must complete all fields before adding a video';
    }
    this.setState({ errorMessage });
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

    fetch(`${url}/api/user/vidprimary/${videoId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then((response) => {
      return response.json();
    }).then((results) => {
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

  handleGenreSelect = (evt, index, value) => {
    let styleId = evt.target.parentElement.parentElement.parentElement.id;
    let pendingGenre = {
      id: styleId,
      value
    };
    let genreSelect = this.state.genreSelect;
    genreSelect[index] = value;
    this.setState({ pendingGenre, genreSelect }, () => {
      this.handleSubmit('selectedGenres', 'pendingGenre', this.state.selectedGenreMax, index);
    });
  }

  handleInstrumentSelect = (evt, index, value) => {
    let instrumentId = evt.target.parentElement.parentElement.parentElement.id;
    let pendingInstrument = {
      id: instrumentId,
      value
    };
    let instrumentSelect = this.state.instrumentSelect;
    instrumentSelect[index] = value;
    this.setState({ pendingInstrument, instrumentSelect }, () => {
      this.handleSubmit('selectedInstruments', 'pendingInstrument', this.state.selectedInstrumentMax, index);
    });
  }

  render() {

    const selectArray = [];

    let actionClickFunc;
    let actionLabel;
    let actions;
    let form;
    let oneVideo = this.state.selectedVideos.length === 1;
    let stage = this.props.onboardingStage;
    let errorMessage = this.state.errorMessage ?
      <p className="error-message">
        {this.state.errorMessage}
      </p>
      :
      null;

    let genreOptions = this.state.genreOptions.map((option) => {
      return (
        <MenuItem
          key={option.style_id}
          id={option.style_id}
          value={option.style_name}
          primaryText={option.style_name}
        />
      )
    })

    let instrumentOptions = this.state.instrumentOptions.map((option) => {
      return (
        <MenuItem
          key={option.instrument_id}
          id={option.instrument_id}
          value={option.name}
          primaryText={option.name}
        />
      )
    })

    if (stage === null && this.props.loggedInUser) {
      this.updateOnboardingStage(this.props.loggedInUser);
    }

    if (stage === 0) {

      for (let i = 0; i < this.state.selectedGenreMax; i++) {

        let selectItem = <SelectField
          floatingLabelText="Select Genre"
          onChange={(evt) => this.handleGenreSelect(evt, i, evt.target.textContent)}
          style={{textAlign: 'left'}}
          value={this.state.genreSelect[i]}
        >
          {genreOptions}
        </SelectField>


        selectArray.push(selectItem);
      }

      actionLabel = 'Continue';
      actionClickFunc = (evt) => {
        this.continue(evt, 'selectedGenres', this.state.selectedGenreMax, this.state.selectedGenreMin, 'genres/add', true)
      };

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

      for (let i = 0; i < this.state.selectedInstrumentMax; i++) {

        let selectItem = <SelectField
          floatingLabelText="Select Instrument"
          onChange={(evt) => this.handleInstrumentSelect(evt, i, evt.target.textContent)}
          style={{textAlign: 'left'}}
          value={this.state.instrumentSelect[i]}
        >
          {instrumentOptions}
        </SelectField>
        selectArray.push(selectItem);

      }

      actionLabel = 'Continue';
      actionClickFunc = (evt) => {
        this.continue(evt, 'selectedInstruments', this.state.selectedInstrumentMax, this.state.selectedInstrumentMin, 'instruments/add', true)
      };

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

      if (oneVideo && this.state.primaryVidIndex !== 0) {
        this.setState({ primaryVidIndex: 0 });
      }

      if (oneVideo && this.state.selectedVideos[0].set_as_primary !== true) {
        let primaryVid = this.state.selectedVideos[0];
        primaryVid.set_as_primary = true;
        this.setState({ selectedInstruments: [primaryVid] });
      }

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

      actionLabel = this.state.selectedVideos.length > 0 ? 'Continue' : 'I\'ll do this later';
      actionClickFunc = (evt) => {
        this.continue(evt, 'selectedVideos', this.state.videoMax, this.state.videoMin, 'user/vids', this.state.selectedVideos.length > 0);
      };

      form = <div className="video-modal">
        <h1>Add YouTube Videos</h1>
        <h3>Upload videos of yourself playing. Choose one as the primary, and make a great first impression!</h3>
        <form className="flex-form">

          <div className="form-inputs">

            <TextField
              floatingLabelText="YouTube Link"
              onChange={(evt) => this.handleInputChange(evt, 'pendingVideo')}
              value={this.state.pendingVideo}
            />
            <TextField
              floatingLabelText="Video Title"
              onChange={(evt) => this.handleInputChange(evt, 'pendingVideoTitle')}
              value={this.state.pendingVideoTitle}
            />
            <TextField
              floatingLabelText="Video Description"
              onChange={(evt) => this.handleInputChange(evt, 'pendingVideoDescription')}
              value={this.state.pendingVideoDescription}
            />
          </div>
          <FloatingActionButton
            mini={true}
            secondary={true}
            onClick={(evt) => {this.handleVidLinkSubmit(evt, 'selectedVideos', 'pendingVideo', 'pendingVideoTitle', 'pendingVideoDescription')}}
            >
              <ContentAdd />
            </FloatingActionButton>

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

    actions = [
      <FlatButton
        label={actionLabel}
        primary={true}
        onClick={actionClickFunc}
      />,
    ];

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
