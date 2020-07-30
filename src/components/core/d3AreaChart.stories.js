import React from 'react';
import { action } from '@storybook/addon-actions';
import AreaChart from './d3AreaChart.js';

const csv = `date,close
2007-04-23,93.24
2007-04-24,95.35
2007-04-25,98.84
2007-04-26,99.92
2007-04-29,99.8
2007-05-01,99.47
2007-05-02,100.39
2007-05-03,100.4
2007-05-04,100.81
2007-05-07,103.92
2007-05-08,105.06
2007-05-09,106.88
2007-05-09,107.34
2007-05-10,108.74
2007-05-13,109.36
2007-05-14,107.52
2007-05-15,107.34
2007-05-16,109.44
2007-05-17,110.02
2007-05-20,111.98`;

export default {
  component: AreaChart,
  title: 'AreaChart',
};

export const Basic = () => <AreaChart csvData={csv} />;
