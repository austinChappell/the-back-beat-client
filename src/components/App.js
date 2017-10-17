import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import store from '../store/';

import BandCreateForm from './BandCreateForm';
import EventPage from './EventPage';
import BandPage from './BandPage';
import BandPageBrowseMusicians from './BandPageBrowseMusicians';
import BaseLayout from './BaseLayout';
import CalendarPage from './CalendarPage';
import ConnectPage from './ConnectPage';
import GigPage from './GigPage';
import Home from './Home';
import LocalEventsPage from './LocalEventsPage';
import LoggedIn from './LoggedIn';
import Logout from './Logout';
import Main from './Main';
import MessagePage from './MessagePage';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyProfile from './MyProfile';
import Onboarding from './Onboarding';
import PrivateRoute from './PrivateRoute';
import Profile from './Profile';
import RehearsalPage from './RehearsalPage';

class App extends Component {
  render() {

    return (
      <div className="App">

        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />

        <Provider store={store}>
          <MuiThemeProvider>
            <Router>
              <BaseLayout>
                <Switch>
                  <PrivateRoute path="/" exact component={Main} />
                  {/* <Route path="/login" component={Home} /> */}
                  <Route path="/login" component={Home} />
                  <PrivateRoute path="/logout" component={Logout} />
                  <PrivateRoute path="/myprofile" component={MyProfile} />
                  <PrivateRoute path="/profile/:username" component={Profile} />
                  <PrivateRoute path="/band/create" component={BandCreateForm} />
                  <PrivateRoute path="/band/:bandId/edit" component={BandCreateForm} />
                  <PrivateRoute exact path="/band/:bandId/search_musicians/admin/:adminId" component={BandPageBrowseMusicians} />
                  <PrivateRoute path="/band/:bandId" component={BandPage} />
                  <PrivateRoute path="/band_event/:eventId" component={EventPage} />
                  <PrivateRoute path="/calendar" component={CalendarPage} />
                  <PrivateRoute path="/connect" component={ConnectPage} />
                  <PrivateRoute path="/gigs" component={GigPage} />
                  <PrivateRoute path="/messages" component={MessagePage} />
                  <PrivateRoute path="/onboarding" component={Onboarding} />
                  <PrivateRoute path="/rehearsals" component={RehearsalPage} />
                  <PrivateRoute path="/event/:eventtype/:eventId" component={EventPage} />
                  <PrivateRoute path="/events" component={LocalEventsPage} />
                </Switch>
              </BaseLayout>
            </Router>
          </MuiThemeProvider>
        </Provider>
      </div>
    );
  }
}

export default App;
