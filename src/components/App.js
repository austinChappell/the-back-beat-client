import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import store from '../store/';

import BaseLayout from './BaseLayout';
import Home from './Home';
import LoggedIn from './LoggedIn';
import PrivateRoute from './PrivateRoute';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Router>
            <BaseLayout>
              <Switch>
                <PrivateRoute path="/" exact component={LoggedIn} />
                {/* <Route path="/login" component={Home} /> */}
                <Route path="/login" component={Home} />
              </Switch>
            </BaseLayout>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
