import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { start as startTimeService } from './services/time.js';

import { Provider } from 'react-redux';

import configureAppStore from './state/configureAppStore.js';

const store = configureAppStore();

store.dispatch(startTimeService());

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-55310450-2');
  TagManager.initialize({ gtmId: 'GTM-W923ZS3' });
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
