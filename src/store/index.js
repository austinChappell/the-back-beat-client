import { createStore } from 'redux';

const initialState = {
  showUserAuthForm: false,
  userAuthType: ''
}

const reducer = (state = initialState, action) => {
  console.log('reducer running', action);
  switch (action.type) {
    case 'TOGGLE_USER_AUTH_FORM':
      return Object.assign({}, state, { showUserAuthForm: !state.showUserAuthForm, userAuthType: action.userAuthType });
    case 'TOGGLE_USER_AUTH_TYPE':
      let newAuthType = state.userAuthType === 'Login' ? 'Sign Up' : 'Login';
      return Object.assign({}, state, { userAuthType: newAuthType });
    case 'USER_AUTH_FORM_SUBMIT':
      return Object.assign({}, state, { showUserAuthForm: false, userAuthType: '' });
    default:
      return state;
  }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
