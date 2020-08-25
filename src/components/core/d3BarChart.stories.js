import React from 'react';
import BarChart from './d3BarChart.js';

const data = [
  { date: '2010', value: 7 },
  { date: '2011', value: 2 },
  { date: '2012', value: 1 },
  { date: '2013', value: 0 },
  { date: '2014', value: 5 },
];

const genData = (count) =>
  Array.from(Array(count).keys()).map((key) => ({
    date: key,
    value: Math.random(),
  }));

export default {
  component: BarChart,
  title: 'BarChart',
};

export const Default = () => <BarChart />;
export const Basic = () => <BarChart data={data} />;
export const Blue = () => <BarChart data={data} color="#2e86c1" />;
export const BigData = () => (
  <BarChart data={genData(30)} color="#2e86c1" yLabel="Y Label" />
);
