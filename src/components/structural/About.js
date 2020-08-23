import React from 'react';
import PropTypes from 'prop-types';
import { Flexbox, Spacer, Text, Button } from 'kvl-react-ui';

import { Link } from '../presentation/Link';

export const About = ({ onHide }) => (
  <Flexbox
    flexDirection="column"
    backgroundColor="#444"
    color="#eee"
    padding="1em"
    maxWidth="80ch"
    margin="1em"
  >
    <Text fontSize="heading">About this visualization</Text>
    <Spacer height="0.5em" />
    <Flexbox flexDirection="column" overflow="auto">
      <Text>
        COVID-19 cases and deaths are displayed as blue and red choropleths as
        reported by the New York Times. Onset, the date of the first case in
        each county are represented by green icons. Hotspots are displays as red
        icons. The geographic visuals are rendered with MapBox. The charts are
        built with D3.
      </Text>
      <Spacer height="1em" />
      <Text fontSize="label">Statistics explained</Text>
      <Spacer height="0.2em" />
      <Text>
        Hotspots by total cases: Hotspots are those counties that have at least
        100 cases and in which total cases have increased 20% in the past two
        weeks.
      </Text>
      <Spacer height="0.5em" />
      <Text>
        Hotspots Per Capita: Hotspots are those counties in which at least 1% of
        the population has been infected in the past two weeks.
      </Text>
      <Spacer height="0.5em" />
      <Text>
        New cases are those reported on most recent day for the county,
        typically yesterday.
      </Text>
      <Spacer height="0.5em" />
      <Text>
        Ongoing cases is an estimate represented by cases reported within the
        past two weeks.
      </Text>
      <Spacer height="0.5em" />
      <Text>
        Death rate compares the current number of deaths to the total number of
        cases two weeks prior.
      </Text>
      <Spacer height="1em" />
      <Text fontSize="label">Data sources</Text>
      <Spacer height="0.5em" />
      <Text>US 2010 census county boundaries</Text>
      <Link href="https://eric.clst.org/tech/usgeojson/">
        <Text fontSize="detail">https://eric.clst.org/tech/usgeojson/</Text>
      </Link>
      <Spacer height="0.5em" />
      <Text>2019 Population Estimates: US Census Bureau</Text>
      <Link href="https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/counties/totals/co-est2019-alldata.csv">
        <Text fontSize="detail">Download raw CSV</Text>
      </Link>
      <Spacer height="0.5em" />
      <Text>
        Cases and deaths, The New York Times, based on reports from state and
        local health agencies:
      </Text>
      <Link href="https://github.com/nytimes/covid-19-data">
        <Text fontSize="detail">https://github.com/nytimes/covid-19-data</Text>
      </Link>
      <Link href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html">
        <Text fontSize="detail">New York Times interactive tracking page</Text>
      </Link>
      <Spacer height="0.5em" />
      <Text>Source code</Text>
      <Link href="https://github.com/kevinvanleer/covidmap">
        <Text fontSize="detail">https://github.com/kevinvanleer/covidmap</Text>
      </Link>
      <Link href="https://github.com/kevinvanleer/coviddata">
        <Text fontSize="detail">https://github.com/kevinvanleer/coviddata</Text>
      </Link>
      <Spacer height="0.5em" />
      <Text fontSize="detail">
        Assembled by Kevin Van Leer. Feedback welcome at:
      </Text>
      <Link href="mailto:kevin.vanleer@gmail.com">kevin.vanleer@gmail.com</Link>
      <Spacer height="1em" />
    </Flexbox>
    <Button id="covidmap-about-hide-self" onClick={onHide}>
      <Text color="#eee">Dismiss</Text>
    </Button>
  </Flexbox>
);

About.propTypes = { onHide: PropTypes.func };
