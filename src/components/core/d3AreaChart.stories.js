import React from 'react';
import moment from 'moment';
import AreaChart from './d3AreaChart.js';
import { covidData } from '../../test/caseData.js';

const current = covidData.find((r) => r.date === '2020-05-01');

export default {
  component: AreaChart,
  title: 'AreaChart',
};

export const Basic = () => (
  <AreaChart
    data={covidData}
    currentDate={moment(current.date, 'YYYY-MM-DD')}
    currentValue={parseInt(current.cases)}
  />
);

export const ShowIntercept = () => (
  <AreaChart
    data={covidData}
    currentDate={moment(current.date, 'YYYY-MM-DD')}
    currentValue={parseInt(current.cases)}
    showIntercept={true}
  />
);

export const Short = () => (
  <AreaChart
    data={covidData}
    currentDate={moment(current.date, 'YYYY-MM-DD')}
    currentValue={parseInt(current.cases)}
    height={100}
  />
);
