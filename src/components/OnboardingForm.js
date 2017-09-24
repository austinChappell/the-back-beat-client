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
      seekingInstrumentMin: 0
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


    }
    //
    // switch(stage) {
    //
    //   case 0:
    //     form = <div>
    //       <h1>What genres do you listen to/play?</h1>
    //       <span>*You must select at least 1 and no more than 5</span>
    //       <form>
    //         <select onChange={(evt) => this.handleChange(evt, 'pendingGenre')}>
    //           {genreOptions}
    //         </select>
    //         <button onClick={(evt) => {this.handleSubmit(evt, 'selectedGenres', 'pendingGenre', this.state.selectedGenreMax)}}>Add Genre</button>
    //       </form>
    //       {this.state.selectedGenres.map((genre, index) => {
    //         return <h3 key={index}>{genre.value}</h3>
    //       })}
    //       <button onClick={() => this.continue('selectedGenres', this.state.selectedGenreMax, 'genres/add')}>Continue</button>
    //     </div>
    //
    //   case 1:
    //     form = <div>
    //       <h1>Choose your instrument(s).</h1>
    //       <span>*You must select at least 1 and no more than 3</span>
    //       <form>
    //         <select onChange={(evt) => this.handleChange(evt, 'pendingInstrument')}>
    //           {instrumentOptions}
    //         </select>
    //         <button onClick={(evt) => {this.handleSubmit(evt, 'selectedInstruments', 'pendingInstrument', this.state.selectedInstrumentMax)}}>Add Instrument</button>
    //       </form>
    //       {this.state.selectedInstruments.map((instrument, index) => {
    //         return <h3 key={index}>{instrument.value}</h3>
    //       })}
    //       <button onClick={() => this.continue('selectedInstruments', this.state.selectedInstrumentMax, 'instruments/add')}>Continue</button>
    //     </div>
    //
    //   default: null;
    // }

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
