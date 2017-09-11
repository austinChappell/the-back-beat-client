import { createStore } from 'redux';

const initialState = {
  authorized: false,
  currentUsername: '',
  showUserAuthForm: false,
  userAuthType: '',
  userInfo: {
    city: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    username: ''
  }
}

const reducer = (state = initialState, action) => {
  console.log('reducer running', action);
  switch (action.type) {
    case 'HANDLE_FORM_INPUT_CHANGE':
      let updateObject = {};
      const inputName = action.input;
      updateObject[inputName] = action.value;
      let newUserInfo = Object.assign({}, state.userInfo, updateObject);
      return Object.assign({}, state, { userInfo: newUserInfo });
    case 'LOGOUT':
      return Object.assign({}, state, { authorized: false, currentUsername: '' });
    case 'TOGGLE_USER_AUTH_FORM':
      return Object.assign({}, state, { showUserAuthForm: !state.showUserAuthForm, userAuthType: action.userAuthType });
    case 'TOGGLE_USER_AUTH_TYPE':
      let newAuthType = state.userAuthType === 'Login' ? 'Sign Up' : 'Login';
      return Object.assign({}, state, { userAuthType: newAuthType });
    case 'USER_AUTH_FORM_SUBMIT':
      const userInfo = {
        city: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        username: ''
      }
      return Object.assign({}, state, { authorized: true, currentUsername: action.username, showUserAuthForm: false, userAuthType: '', userInfo });
    default:
      return state;
  }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
