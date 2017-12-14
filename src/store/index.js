import { createStore } from 'redux';

let apiURL;

if (process.env.NODE_ENV === 'development') {
  apiURL = 'http://localhost:6001';
} else {
  apiURL = 'https://back-beat-server.herokuapp.com';
}

const initialState = {

  // GENERAL ITEMS
  apiURL: apiURL,
  allInstruments: [],
  attemptedLogin: false,
  authToken: 'noToken',
  authorized: false,
  bandInstruments: [],
  numOfUnreadMessages: 0,
  selectedInstrumentIds: [],
  showUserAuthForm: false,
  userAuthType: '',
  skillLevels: ['Professional', 'Semi-Professional', 'Amateur', 'Novice'],
  onboardingMaxStage: 3,
  onboardingReqMaxStage: 1,

  // USER INFO
  compatibleMusicians: [],
  currentUsername: '',
  currentUser: {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    city: '',
    skill_level: ''
  },
  currentUserInstruments: [],
  currentUserVids: [],
  currentUserTracks: [],
  loggedInUser: {},
  userInfo: {
    bio: '',
    city: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    username: '',
    skillLevel: '',
  },
  userStyleIds: [],
  onboardingStage: this.onboardingMaxStage + 1,

  // EVENT INFO
  allEventsInCity: [],
  loggedInUserEvents: [],
  gigs: [],
  profileContent: 'main',
  rehearsals: [],

  // MESSAGE INFO
  currentMessage: '',
  allMessages: [],
  messageSearchBarVal: '',
  messageHistory: [],
  selectedMessages: [],
  currentRecipient: null,
  users: [],

  // GLOBAL VARIABLES
  YOUTUBE_API_KEY: 'AIzaSyCEr0896OYYnqIYoaA7rrRy49cOpsF3ypM'
}

const reducer = (state = initialState, action) => {
  // console.log('reducer running', action);
  const blankUserInfo = {
    city: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    username: ''
  }
  switch (action.type) {
    case 'ADD_INSTRUMENTS_TO_CURRENT_USER':
      const currentUser = state.currentUser;
      currentUser.instruments = action.instrumentArray;
      return Object.assign({}, state, currentUser);
    case 'ADD_LOGGED_IN_USER':
      const loggedInUser = action.user;
      console.log('Save User');
      return Object.assign({}, state, { loggedInUser });
    case 'CHANGE_PROFILE_CONTENT':
      return Object.assign({}, state, { profileContent: action.value });
    case 'CLEAR_CURRENT_MESSAGE_TEXT':
      return Object.assign({}, state, { currentMessage: '' });
    case 'CLEAR_CURRENT_RECIPIENT':
      return Object.assign({}, state, { currentRecipient: null });
    case 'CLEAR_MESSAGE_HISTORY':
      return Object.assign({}, state, { messageHistory: [] });
    case 'CLEAR_SELECTED_MESSAGES':
      return Object.assign({}, state, { selectedMessages: [] });
    case 'GET_COMPATIBLE_MUSICIANS':
      return Object.assign({}, state, { compatibleMusicians: action.data });
    case 'HANDLE_FORM_INPUT_CHANGE':
      let updateObject = {};
      const inputName = action.input;
      updateObject[inputName] = action.value;
      let newUserInfo = Object.assign({}, state.userInfo, updateObject);
      return Object.assign({}, state, { userInfo: newUserInfo });
    case 'HANDLE_MESSAGE_SEARCH_VAL_CHANGE':
      return Object.assign({}, state, { messageSearchBarVal: action.val, users: action.users });
    case 'LOAD_EVENTS':
      return Object.assign({}, state, { allEventsInCity: action.events });
    case 'LOGOUT':
      return Object.assign({}, state, initialState);
    case 'RESET_CURRENT_MESSAGE':
      return Object.assign({}, state, { currentMessage: '' });
    case 'SET_ALL_INSTRUMENTS':
        return Object.assign({}, state, { allInstruments: action.instruments });
    case 'SET_ALL_MESSAGES':
      return Object.assign({}, state, { allMessages: action.allMessages });
    case 'SET_AUTH_TOKEN':
      return Object.assign({}, state, { authToken: action.token });
    case 'SET_BAND_INSTRUMENTS':
      return Object.assign({}, state, { bandInstruments: action.instruments });
    case 'SET_CURRENT_USER_TRACKS':
      return Object.assign({}, state, { currentUserTracks: action.tracks });
    case 'SET_CURRENT_USER_VIDS':
      return Object.assign({}, state, { currentUserVids: action.videos });
    case 'SET_CURRENT_RECIPIENT':
      return Object.assign({}, state, { currentRecipient: action.user, users: [], messageSearchBarVal: '', });
    case 'SET_CURRENT_MESSAGES':
      return Object.assign({}, state, { selectedMessages: action.messages });
    case 'SET_GIGS':
      return Object.assign({}, state, { gigs: action.gigs });
    case 'SET_REHEARSALS':
      return Object.assign({}, state, { rehearsals: action.rehearsals });
    case 'SET_MSG_HISTORY':
      return Object.assign({}, state, { messageHistory: action.output });
    case 'SET_ONBOARDING_STAGE':
      return Object.assign({}, state, { onboardingStage: action.stage });
    case 'SET_SELECTED_INSTRUMENT_IDS':
      return Object.assign({}, state, { selectedInstrumentIds: action.selectedInstrumentIds });
    case 'SET_USER_STYLE_IDS':
      return Object.assign({}, state, { userStyleIds: action.styles });
    case 'TOGGLE_USER_AUTH_FORM':
      return Object.assign({}, state, { showUserAuthForm: !state.showUserAuthForm, userAuthType: action.userAuthType, userInfo: blankUserInfo });
    case 'TOGGLE_USER_AUTH_TYPE':
      let newAuthType = state.userAuthType === 'Login' ? 'Sign Up' : 'Login';
      return Object.assign({}, state, { userAuthType: newAuthType, userInfo: blankUserInfo });
    case 'UPDATE_CURRENT_MESSAGE':
      return Object.assign({}, state, { currentMessage: action.val });
    case 'UPDATE_INSTRUMENTS':
      return Object.assign({}, state, { currentUserInstruments: action.instruments });
    case 'UPDATE_NUM_OF_UNREAD_MSGS':
      return Object.assign({}, state, { numOfUnreadMessages: action.num });
    case 'UPDATE_ONBOARDING_STAGE':
      return Object.assign({}, state, { onboardingStage: action.stage });
    case 'UPDATE_SELECTED_INSTRUMENT_IDS':
      return Object.assign({}, state, { selectedInstrumentIds: action.selectedInstrumentIds });
    case 'UPDATE_USER':
      return Object.assign({}, state, { currentUser: action.user });
    case 'UPDATE_USER_INFO':
      return Object.assign({}, state, { userInfo: action.userInfo });
    case 'USER_AUTH_FORM_SUBMIT':
      return Object.assign({}, state, { authorized: true, currentUsername: action.username, showUserAuthForm: false, userAuthType: '' });
    case 'USER_HYDRATE':
      return Object.assign({}, state, { loggedInUser: action.user });
    default:
      return state;
  }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
