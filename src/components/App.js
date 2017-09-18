import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import store from '../store/';

import BandCreateForm from './BandCreateForm';
import BandPage from './BandPage';
import BaseLayout from './BaseLayout';
import ConnectPage from './ConnectPage';
import Home from './Home';
import LoggedIn from './LoggedIn';
import Logout from './Logout';
import Main from './Main';
import PrivateRoute from './PrivateRoute';
import Profile from './Profile';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Router>
            <BaseLayout>
              <Switch>
                <PrivateRoute path="/" exact component={Main} />
                {/* <Route path="/login" component={Home} /> */}
                <Route path="/login" component={Home} />
                <PrivateRoute path="/logout" component={Logout} />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/band/create" component={BandCreateForm} />
                <PrivateRoute path="/band/:bandId/edit" component={BandCreateForm} />
                <PrivateRoute path="/band/:bandId" component={BandPage} />
                <PrivateRoute path="/connect" component={ConnectPage} />
              </Switch>
            </BaseLayout>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
