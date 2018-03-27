import data from '../data';

const api = data.apiURL;

class Api {
  createUser = (user, cb) => fetch(`${api}/signup`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(user),
  })
    .then(response => response.json())
    .then((results) => {
      cb(results);
    })
    .catch(err => console.error('PROBLEM LOGGING OUT', err));

  getProfile = (username, token, cb) =>
    fetch(`${api}/api/profile/${username}/`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        token,
      },
    })
      .then(response => response.json())
      .then((results) => {
        cb(results);
      });

  getUserInfo = (userid, token, cb, cbError) =>
    fetch(`${api}/api/user/id/${userid}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then((results) => {
        const user = results[0];
        const {
          first_name, id, is_active, last_name, onboarding_stage,
        } = user;
        cb(user)
      })
      .catch((err) => {
        throw err;
      });

  login = (credentials, cb) => fetch(`${api}/login`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(credentials),
  })
    .then(response => response.json())
    .then((results) => {
      cb(results);
    })
    .catch((err) => {
      console.error('LOGIN ERROR', err);
    });

  logout = cb => fetch(`${api}/logout`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then(response => response.json())
    .then((results) => {
      cb(results);
    })
    .catch(err => console.error('PROBLEM LOGGING OUT', err));
}

export default Api;
