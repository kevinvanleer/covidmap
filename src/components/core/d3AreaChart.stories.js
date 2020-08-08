import React from 'react';
import moment from 'moment';
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

const covidData = [
  {
    date: '2020-03-18',
    cases: '3',
    deaths: '0',
  },
  {
    date: '2020-03-19',
    cases: '4',
    deaths: '0',
  },
  {
    date: '2020-03-20',
    cases: '4',
    deaths: '0',
  },
  {
    date: '2020-03-21',
    cases: '5',
    deaths: '0',
  },
  {
    date: '2020-03-22',
    cases: '5',
    deaths: '0',
  },
  {
    date: '2020-03-23',
    cases: '9',
    deaths: '0',
  },
  {
    date: '2020-03-24',
    cases: '10',
    deaths: '0',
  },
  {
    date: '2020-03-25',
    cases: '14',
    deaths: '0',
  },
  {
    date: '2020-03-26',
    cases: '19',
    deaths: '0',
  },
  {
    date: '2020-03-27',
    cases: '21',
    deaths: '0',
  },
  {
    date: '2020-03-28',
    cases: '25',
    deaths: '2',
  },
  {
    date: '2020-03-29',
    cases: '25',
    deaths: '2',
  },
  {
    date: '2020-03-30',
    cases: '27',
    deaths: '2',
  },
  {
    date: '2020-03-31',
    cases: '34',
    deaths: '2',
  },
  {
    date: '2020-04-01',
    cases: '41',
    deaths: '2',
  },
  {
    date: '2020-04-02',
    cases: '43',
    deaths: '2',
  },
  {
    date: '2020-04-03',
    cases: '54',
    deaths: '2',
  },
  {
    date: '2020-04-04',
    cases: '68',
    deaths: '2',
  },
  {
    date: '2020-04-05',
    cases: '86',
    deaths: '2',
  },
  {
    date: '2020-04-06',
    cases: '128',
    deaths: '3',
  },
  {
    date: '2020-04-07',
    cases: '147',
    deaths: '3',
  },
  {
    date: '2020-04-08',
    cases: '201',
    deaths: '3',
  },
  {
    date: '2020-04-09',
    cases: '214',
    deaths: '3',
  },
  {
    date: '2020-04-10',
    cases: '230',
    deaths: '3',
  },
  {
    date: '2020-04-11',
    cases: '255',
    deaths: '4',
  },
  {
    date: '2020-04-12',
    cases: '281',
    deaths: '4',
  },
  {
    date: '2020-04-13',
    cases: '288',
    deaths: '6',
  },
  {
    date: '2020-04-14',
    cases: '329',
    deaths: '7',
  },
  {
    date: '2020-04-15',
    cases: '345',
    deaths: '8',
  },
  {
    date: '2020-04-16',
    cases: '352',
    deaths: '9',
  },
  {
    date: '2020-04-17',
    cases: '384',
    deaths: '9',
  },
  {
    date: '2020-04-18',
    cases: '417',
    deaths: '10',
  },
  {
    date: '2020-04-19',
    cases: '417',
    deaths: '10',
  },
  {
    date: '2020-04-20',
    cases: '430',
    deaths: '13',
  },
  {
    date: '2020-04-21',
    cases: '459',
    deaths: '14',
  },
  {
    date: '2020-04-22',
    cases: '503',
    deaths: '15',
  },
  {
    date: '2020-04-23',
    cases: '539',
    deaths: '15',
  },
  {
    date: '2020-04-24',
    cases: '558',
    deaths: '15',
  },
  {
    date: '2020-04-25',
    cases: '579',
    deaths: '18',
  },
  {
    date: '2020-04-26',
    cases: '625',
    deaths: '22',
  },
  {
    date: '2020-04-27',
    cases: '652',
    deaths: '23',
  },
  {
    date: '2020-04-28',
    cases: '728',
    deaths: '23',
  },
  {
    date: '2020-04-29',
    cases: '743',
    deaths: '25',
  },
  {
    date: '2020-04-30',
    cases: '759',
    deaths: '26',
  },
  {
    date: '2020-05-01',
    cases: '773',
    deaths: '27',
  },
  {
    date: '2020-05-02',
    cases: '793',
    deaths: '29',
  },
  {
    date: '2020-05-03',
    cases: '821',
    deaths: '30',
  },
  {
    date: '2020-05-04',
    cases: '833',
    deaths: '30',
  },
  {
    date: '2020-05-05',
    cases: '847',
    deaths: '32',
  },
  {
    date: '2020-05-06',
    cases: '891',
    deaths: '33',
  },
  {
    date: '2020-05-07',
    cases: '945',
    deaths: '34',
  },
  {
    date: '2020-05-08',
    cases: '963',
    deaths: '36',
  },
  {
    date: '2020-05-09',
    cases: '985',
    deaths: '38',
  },
  {
    date: '2020-05-10',
    cases: '1016',
    deaths: '38',
  },
  {
    date: '2020-05-11',
    cases: '1044',
    deaths: '39',
  },
  {
    date: '2020-05-12',
    cases: '1060',
    deaths: '43',
  },
  {
    date: '2020-05-13',
    cases: '1084',
    deaths: '45',
  },
  {
    date: '2020-05-14',
    cases: '1115',
    deaths: '46',
  },
  {
    date: '2020-05-15',
    cases: '1146',
    deaths: '48',
  },
  {
    date: '2020-05-16',
    cases: '1176',
    deaths: '52',
  },
  {
    date: '2020-05-17',
    cases: '1197',
    deaths: '52',
  },
  {
    date: '2020-05-18',
    cases: '1219',
    deaths: '52',
  },
  {
    date: '2020-05-19',
    cases: '1238',
    deaths: '53',
  },
  {
    date: '2020-05-20',
    cases: '1253',
    deaths: '55',
  },
  {
    date: '2020-05-21',
    cases: '1281',
    deaths: '55',
  },
  {
    date: '2020-05-22',
    cases: '1296',
    deaths: '56',
  },
  {
    date: '2020-05-23',
    cases: '1315',
    deaths: '56',
  },
  {
    date: '2020-05-24',
    cases: '1340',
    deaths: '56',
  },
  {
    date: '2020-05-25',
    cases: '1356',
    deaths: '56',
  },
  {
    date: '2020-05-26',
    cases: '1368',
    deaths: '57',
  },
  {
    date: '2020-05-27',
    cases: '1374',
    deaths: '61',
  },
  {
    date: '2020-05-28',
    cases: '1392',
    deaths: '61',
  },
  {
    date: '2020-05-29',
    cases: '1401',
    deaths: '62',
  },
  {
    date: '2020-05-30',
    cases: '1432',
    deaths: '63',
  },
  {
    date: '2020-05-31',
    cases: '1436',
    deaths: '63',
  },
  {
    date: '2020-06-01',
    cases: '1440',
    deaths: '63',
  },
  {
    date: '2020-06-02',
    cases: '1450',
    deaths: '66',
  },
  {
    date: '2020-06-03',
    cases: '1451',
    deaths: '66',
  },
  {
    date: '2020-06-04',
    cases: '1454',
    deaths: '69',
  },
  {
    date: '2020-06-05',
    cases: '1465',
    deaths: '71',
  },
  {
    date: '2020-06-06',
    cases: '1496',
    deaths: '72',
  },
  {
    date: '2020-06-07',
    cases: '1511',
    deaths: '76',
  },
  {
    date: '2020-06-08',
    cases: '1513',
    deaths: '76',
  },
  {
    date: '2020-06-09',
    cases: '1522',
    deaths: '76',
  },
  {
    date: '2020-06-10',
    cases: '1530',
    deaths: '78',
  },
  {
    date: '2020-06-11',
    cases: '1543',
    deaths: '79',
  },
  {
    date: '2020-06-12',
    cases: '1544',
    deaths: '79',
  },
  {
    date: '2020-06-13',
    cases: '1554',
    deaths: '82',
  },
  {
    date: '2020-06-14',
    cases: '1557',
    deaths: '83',
  },
  {
    date: '2020-06-15',
    cases: '1565',
    deaths: '83',
  },
  {
    date: '2020-06-16',
    cases: '1573',
    deaths: '84',
  },
  {
    date: '2020-06-17',
    cases: '1579',
    deaths: '84',
  },
  {
    date: '2020-06-18',
    cases: '1584',
    deaths: '84',
  },
  {
    date: '2020-06-19',
    cases: '1602',
    deaths: '84',
  },
  {
    date: '2020-06-20',
    cases: '1606',
    deaths: '84',
  },
  {
    date: '2020-06-21',
    cases: '1613',
    deaths: '84',
  },
  {
    date: '2020-06-22',
    cases: '1620',
    deaths: '84',
  },
  {
    date: '2020-06-23',
    cases: '1624',
    deaths: '89',
  },
  {
    date: '2020-06-24',
    cases: '1628',
    deaths: '89',
  },
  {
    date: '2020-06-25',
    cases: '1630',
    deaths: '89',
  },
  {
    date: '2020-06-26',
    cases: '1635',
    deaths: '89',
  },
  {
    date: '2020-06-27',
    cases: '1652',
    deaths: '89',
  },
  {
    date: '2020-06-28',
    cases: '1663',
    deaths: '89',
  },
  {
    date: '2020-06-29',
    cases: '1672',
    deaths: '89',
  },
  {
    date: '2020-06-30',
    cases: '1690',
    deaths: '89',
  },
  {
    date: '2020-07-01',
    cases: '1699',
    deaths: '90',
  },
  {
    date: '2020-07-02',
    cases: '1716',
    deaths: '90',
  },
  {
    date: '2020-07-03',
    cases: '1730',
    deaths: '92',
  },
  {
    date: '2020-07-04',
    cases: '1735',
    deaths: '92',
  },
  {
    date: '2020-07-05',
    cases: '1746',
    deaths: '92',
  },
  {
    date: '2020-07-06',
    cases: '1761',
    deaths: '92',
  },
  {
    date: '2020-07-07',
    cases: '1784',
    deaths: '92',
  },
  {
    date: '2020-07-08',
    cases: '1790',
    deaths: '92',
  },
  {
    date: '2020-07-09',
    cases: '1795',
    deaths: '92',
  },
  {
    date: '2020-07-10',
    cases: '1815',
    deaths: '92',
  },
  {
    date: '2020-07-11',
    cases: '1829',
    deaths: '92',
  },
  {
    date: '2020-07-12',
    cases: '1848',
    deaths: '92',
  },
  {
    date: '2020-07-13',
    cases: '1857',
    deaths: '92',
  },
  {
    date: '2020-07-14',
    cases: '1865',
    deaths: '92',
  },
  {
    date: '2020-07-15',
    cases: '1876',
    deaths: '94',
  },
  {
    date: '2020-07-16',
    cases: '1887',
    deaths: '94',
  },
  {
    date: '2020-07-17',
    cases: '1978',
    deaths: '94',
  },
  {
    date: '2020-07-18',
    cases: '1995',
    deaths: '95',
  },
  {
    date: '2020-07-19',
    cases: '2000',
    deaths: '95',
  },
  {
    date: '2020-07-20',
    cases: '2013',
    deaths: '95',
  },
  {
    date: '2020-07-21',
    cases: '2017',
    deaths: '96',
  },
  {
    date: '2020-07-22',
    cases: '2025',
    deaths: '96',
  },
  {
    date: '2020-07-23',
    cases: '2058',
    deaths: '96',
  },
  {
    date: '2020-07-24',
    cases: '2102',
    deaths: '105',
  },
  {
    date: '2020-07-25',
    cases: '2091',
    deaths: '105',
  },
  {
    date: '2020-07-26',
    cases: '2117',
    deaths: '105',
  },
  {
    date: '2020-07-27',
    cases: '2125',
    deaths: '105',
  },
];

const current = covidData.find((r) => r.date === '2020-05-01');

export default {
  component: AreaChart,
  title: 'AreaChart',
};

export const Basic = () => (
  <AreaChart
    data={covidData}
    currentDate={moment(current.date, 'YYYY-MM-DD')}
    currentValue={current.cases}
  />
);
