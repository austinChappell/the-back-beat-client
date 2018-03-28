import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import store from '../store/';

import Activate from './Activate';
import ActivateInstructions from './ActivateInstructions';
import BandCalendar from './BandCalendar';
import BandChat from './BandChat';
import BandCreateForm from './BandCreateForm';
import BandDashboard from './BandDashboard';
import BandUploads from './BandUploads';
import EventPage from './EventPage';
import BandPage from './BandPage';
import BandPageBrowseMusicians from './BandPageBrowseMusicians';
import BaseLayout from './BaseLayout';
import CalendarPage from './CalendarPage';
import ConnectPage from './ConnectPage';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import GigPage from './GigPage';
import Home from './Home';
import LocalEventsPage from './LocalEventsPage';
import Logout from './Logout';
import Main from './Main';
import MessagePage from './MessagePage';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyProfile from './MyProfile';
import Onboarding from './Onboarding';
import PerformedWithPage from './PerformedWithPage';
import PrivateRoute from './PrivateRoute';
import Profile from './Profile';
import RehearsalPage from './RehearsalPage';

require('dotenv');

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#070649',
    primary2Color: '#9A6197',
    primary3Color: '#B8B7D5',
    accent1Color: '#9A6197',
    // accent2Color: grey100,
    // accent3Color: grey500,
    // textColor: darkBlack,
    // alternateTextColor: white,
    // canvasColor: white,
    // borderColor: grey300,
    // disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: '#070649',
    // clockCircleColor: fade(darkBlack, 0.07),
    // shadowColor: fullBlack,
  },
});

class App extends Component {
  render() {

    return (
      <div className="App">

        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />

        <Provider store={store}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <Router>
              <BaseLayout>
                <Switch>
                  <Route path="/activate_instructions" component={ActivateInstructions} />
                  <Route path="/activate/:username/:activationKey" component={Activate} />
                  <PrivateRoute path="/" exact component={Main} />
                  {/* <Route path="/login" component={Home} /> */}
                  <Route path="/login" component={Home} />
                  <PrivateRoute path="/logout" component={Logout} />
                  <PrivateRoute path="/myprofile" component={MyProfile} />
                  <PrivateRoute path="/profile/:username" component={Profile} />
                  <PrivateRoute path="/band/create" component={BandCreateForm} />
                  <PrivateRoute path="/band/:bandId/edit" component={BandCreateForm} />
                  <PrivateRoute path="/band/:bandId/calendar" component={BandCalendar} />
                  <PrivateRoute path="/band/:bandId/chat" component={BandChat} />
                  <PrivateRoute path="/band/:bandId/dashboard" component={BandDashboard} />
                  <PrivateRoute path="/band/:bandId/uploads" component={BandUploads} />
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
                  <PrivateRoute path="/performed_with" component={PerformedWithPage} />
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
