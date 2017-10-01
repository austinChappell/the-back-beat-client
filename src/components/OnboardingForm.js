import React, { Component } from 'react';
import { connect } from 'react-redux';

class OnboardingForm extends Component {

  constructor() {
    super();

    this.state = {
      genreOptions: [],
      pendingGenre: '',
      selectedGenres: [],
      selectedGenreMax: 5,
      selectedGenreMin: 1,
      instrumentOptions: [],
      pendingInstrument: '',
      selectedInstruments: [],
      selectedInstrumentMax: 3,
      selectedInstrumentMin: 1,
      seekingInstrumentMax: 3,
      seekingInstrumentMin: 0,
      pendingVideo: '',
      pendingVideoTitle: '',
      selectedVideos: [],
      primaryVidIndex: null,
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
  }

  handleChange = (evt, category) => {
    const updateState = {};
    updateState[category] = {
      id: evt.target.children[evt.target.selectedIndex].id,
      value: evt.target.value
    };
    this.setState(updateState);
  }

  handleInputChange = (evt, category) => {
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

  handleSubmit = (evt, array, element, max) => {
    evt.preventDefault();
    const updateState = {};
    updateState[array] = this.state[array].slice();
    // PREVENT DUPLICATES IN THE ARRAY AND DO NOT ALLOW THE ARRAY TO EXCEED 5 ELEMENTS
    if (updateState[array].indexOf(this.state[element]) === -1 && updateState[array].length < max) {
      updateState[array].push(this.state[element]);
    }
    this.setState(updateState, () => {
      console.log(this.state);
    });
  }

  handleVidLinkSubmit = (evt, array, url, title) => {
    evt.preventDefault();
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
      video_title: this.state[title],
      youtube_id: vidID
    });
    updateState[array] = updateArray;
    updateState[url] = '';
    updateState[title] = '';
    this.setState(updateState, () => {
      console.log('STATE', this.state);
    });
  }

  removeItem = (arrayName, index) => {
    const updateObject = {};
    let newArray = this.state[arrayName].slice();
    newArray.splice(index, 1);
    updateObject[arrayName] = newArray;
    this.setState(updateObject);
  }

  continue = (onboardingCategory, max, min, query) => {
    if (this.state[onboardingCategory].length >= min && this.state[onboardingCategory].length <= max) {
      const url = this.props.apiURL;
      this.state[onboardingCategory].forEach((item) => {


        console.log('continue button works');
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

    }
  }

  render() {

    let stage = this.props.onboardingStage;
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


    if (stage === 0) {


      form = <div>
        <h1>What genres do you listen to/play?</h1>
        <span>*You must select at least 1 and no more than 5</span>
        <form>
          <select onChange={(evt) => this.handleChange(evt, 'pendingGenre')}>
            {genreOptions}
          </select>
          <button onClick={(evt) => {this.handleSubmit(evt, 'selectedGenres', 'pendingGenre', this.state.selectedGenreMax)}}>Add Genre</button>
        </form>
        {this.state.selectedGenres.map((genre, index) => {
          return <h3 key={index}>{genre.value}</h3>
        })}
        <button onClick={() => this.continue('selectedGenres', this.state.selectedGenreMax, this.state.selectedGenreMin, 'genres/add')}>Continue</button>
      </div>


    } else if (stage === 1) {


      form = <div>
        <h1>Choose your instrument(s).</h1>
        <span>*You must select at least 1 and no more than 3</span>
        <form>
          <select onChange={(evt) => this.handleChange(evt, 'pendingInstrument')}>
            {instrumentOptions}
          </select>
          <button onClick={(evt) => {this.handleSubmit(evt, 'selectedInstruments', 'pendingInstrument', this.state.selectedInstrumentMax)}}>Add Instrument</button>
        </form>
        {this.state.selectedInstruments.map((instrument, index) => {
          return <h3 key={index}>{instrument.value}</h3>
        })}
        <button onClick={() => this.continue('selectedInstruments', this.state.selectedInstrumentMax, this.state.selectedInstrumentMin, 'instruments/add')}>Continue</button>
      </div>


    } else if (stage == 2) {


      form = <div>
        <h1>What type of musician(s) are you searching for?</h1>
        <form>
          <select onChange={(evt) => this.handleChange(evt, 'pendingInstrument')}>
            {instrumentOptions}
          </select>
          <button onClick={(evt) => {this.handleSubmit(evt, 'selectedInstruments', 'pendingInstrument', this.state.seekingInstrumentMax)}}>Add Instrument</button>
        </form>
        {this.state.selectedInstruments.map((instrument, index) => {
          return <h3 key={index}>{instrument.value}</h3>
        })}
        <button onClick={() => this.continue('selectedInstruments', this.state.seekingInstrumentMax, this.state.seekingInstrumentMin, 'instruments_seeking/add')}>{this.state.selectedInstruments.length > 0 ? 'Continue' : 'I\'ll do this later'}</button>
      </div>


    } else if (stage == 3) {


        form = <div>
          <h1>Add some vids</h1>
          <h3>(This is strongly recommended)</h3>
          <p>Provide links to YouTube videos of yourself performing below.</p>
          <form>
            <input onChange={(evt) => this.handleInputChange(evt, 'pendingVideo')} value={this.state.pendingVideo} />
            <input onChange={(evt) => this.handleInputChange(evt, 'pendingVideoTitle')} value={this.state.pendingVideoTitle} />
            <button onClick={(evt) => {this.handleVidLinkSubmit(evt, 'selectedVideos', 'pendingVideo', 'pendingVideoTitle')}}>Add Video</button>
          </form>
          {this.state.selectedVideos.map((video, index) => {
            return (
              <div key={index}>
                <input
                  type="radio"
                  checked={index === this.state.primaryVidIndex}
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
          <button onClick={() => this.continue('selectedVideos', this.state.videoMax, this.state.videoMin, 'user/vids')}>{this.state.selectedInstruments.length > 0 ? 'Continue' : 'I\'ll do this later'}</button>
        </div>

    }

    return (
      <div className="OnboardingForm">
        Onboarding Form Component
        { form }
      </div>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser,
    onboardingMaxStage: state.onboardingMaxStage,
    onboardingStage: state.onboardingStage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateOnboardingStage: (stage) => {
      const action = {type: 'UPDATE_ONBOARDING_STAGE', stage};
      dispatch(action);
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OnboardingForm);
