import React from 'react';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';

const matomoInstance = createInstance({
  urlBase: 'https://kevinvanleer.matomo.cloud/',
});

export const AnalyticsProvider = ({ ...props }) => (
  <MatomoProvider value={matomoInstance} {...props} />
);
