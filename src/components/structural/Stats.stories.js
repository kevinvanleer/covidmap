import React from 'react';
import { Stats } from './Stats.js';

export default {
  component: Stats,
  title: 'Stats',
};
export const Typical = () => (
  <Stats
    collapsed={false}
    population={{ POPESTIMATE2019: '888888888' }}
    deathRate={{ twoWeek: 0.008 }}
    recentData={{ deaths: 8, cases: 888 }}
    newCases={8}
    ongoingCases={88}
  />
);
