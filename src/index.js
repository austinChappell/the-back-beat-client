import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { } from 'dotenv/config';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
