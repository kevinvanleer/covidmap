import React from 'react';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';

const matomoInstance = createInstance({
  urlBase: 'https://kevinvanleer.matomo.cloud/',
  disabled: process.env.NODE_ENV !== 'production', // optional, false by default. Makes all tracking calls no-ops if set to true.
});

export const AnalyticsProvider = ({ ...props }) => (
  <MatomoProvider value={matomoInstance} {...props} />
);
