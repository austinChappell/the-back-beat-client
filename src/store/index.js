import { createStore } from 'redux';

const initialState = {

  // GENERAL ITEMS
  apiURL: 'http://localhost:6001',
  attemptedLogin: false,
  authorized: false,
  showUserAuthForm: false,
  userAuthType: '',
  skillLevels: ['Professional', 'Semi-Professional', 'Amateur', 'Novice'],
  onboardingMaxStage: 3,

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
  loggedInUser: {},
  userInfo: {
    city: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    username: '',
    skillLevel: '',
  },
  userStyleIds: [],
  onboardingStage: 0,

  // EVENT INFO
  gigs: [
    {title: 'United Methodist', date: '9/23', time: '7:00pm', details: 'Playing a Sunday night service at First United Methodist Church of Lewisville.'},
    {title: 'Andy\'s', date: '9/25', time:'9:00pm', details: 'Gig with Ashley Gatta and The Free People. Might go on later.'},
    {title: 'House of Blues', date:'9/30', time: '10:00pm', details: 'Opening for Mutemath. Load in is at 8:00pm, soundcheck at 9:00pm.'}
  ],
  profileContent: 'main',
  rehearsals: [
    {title: 'United Methodist', date: '9/19', time: '2:00pm', location: 'Cody\'s house'},
    {title: 'Andy\'s', date: '9/22', time:'7:00pm', location: 'Ashley\'s house'},
    {title: 'House of Blues', date:'9/28', time: '8:00pm', location: 'Silver Studios in Dallas'}
  ],

  // MESSAGE INFO
  currentMessage: '',
  allMessages: [],
  messageSearchBarVal: '',
  messageHistory: [],
  selectedMessages: [],
  currentRecipient: null,
  users: []
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
    case 'LOGOUT':
      return Object.assign({}, state, initialState);
    case 'RESET_CURRENT_MESSAGE':
      return Object.assign({}, state, { currentMessage: '' });
    case 'SET_ALL_MESSAGES':
      return Object.assign({}, state, { allMessages: action.allMessages });
    case 'SET_CURRENT_USER_VIDS':
      return Object.assign({}, state, { currentUserVids: action.videos });
    case 'SET_CURRENT_RECIPIENT':
      return Object.assign({}, state, { currentRecipient: action.user, users: [], messageSearchBarVal: '', });
    case 'SET_CURRENT_MESSAGES':
      return Object.assign({}, state, { selectedMessages: action.messages });
    case 'SET_MSG_HISTORY':
      return Object.assign({}, state, { messageHistory: action.output });
    case 'SET_ONBOARDING_STAGE':
      return Object.assign({}, state, { onboardingStage: action.stage });
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
    case 'UPDATE_ONBOARDING_STAGE':
      return Object.assign({}, state, { onboardingStage: action.stage });
    case 'UPDATE_USER':
      return Object.assign({}, state, { currentUser: action.user });
    case 'USER_AUTH_FORM_SUBMIT':
      return Object.assign({}, state, { authorized: true, currentUsername: action.username, showUserAuthForm: false, userAuthType: '' });
    default:
      return state;
  }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
