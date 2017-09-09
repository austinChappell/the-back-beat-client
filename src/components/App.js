import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import store from '../store/';

import BaseLayout from './BaseLayout';
import Home from './Home';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Router>
            <BaseLayout>
              <Switch>
                <Route path="/" exact component={Home} />
              </Switch>
            </BaseLayout>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
