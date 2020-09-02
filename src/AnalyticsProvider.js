import React from 'react';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';

const matomoInstance = createInstance({
  urlBase: 'https://kevinvanleer.matomo.cloud/',
  siteId: 1, // optional, default value: `1`
  userId: undefined, // optional, default value: `undefined`.
  disabled: process.env.NODE_ENV !== 'production', // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: {
    // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10, // optional, default value: `15
  },
  linkTracking: false, // optional, default value: true
  configurations: {
    // optional, default value: {}
    // any valid matomo configuration, all below are optional
    disableCookies: true,
    setSecureCookie: true,
    setRequestMethod: 'POST',
  },
});

export const AnalyticsProvider = ({ ...props }) => (
  <MatomoProvider value={matomoInstance} {...props} />
);
