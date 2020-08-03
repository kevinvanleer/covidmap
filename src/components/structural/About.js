import React from 'react';
import PropTypes from 'prop-types';
import { Flexbox, Spacer, Text, Button } from 'kvl-ui';

export const About = ({ onHide }) => (
  <Flexbox
    flexDirection="column"
    backgroundColor="#444"
    color="#eee"
    padding="1em"
    maxWidth="80ch"
  >
    <Text fontSize="heading">About this visualization</Text>
    <Spacer height="0.5em" />
    <Text>
      This visualization depicts COVID-19 cases and deaths since the onset of
      the pandemic. The geographic visuals are handled by mapbox. The charts are
      built with D3.
    </Text>
    <Spacer height="0.5em" />
    <Text fontSize="label">Data sources</Text>
    <Spacer height="0.5em" />
    <Text>US 2010 census county boundaries</Text>
    <a href="https://eric.clst.org/tech/usgeojson/">
      <Text fontSize="detail">https://eric.clst.org/tech/usgeojson/</Text>
    </a>
    <Spacer height="0.5em" />
    <Text>New York Times COVID-19 US county-level historic data</Text>
    <a href="https://github.com/nytimes/covid-19-data">
      <Text fontSize="detail">https://github.com/nytimes/covid-19-data</Text>
    </a>
    <Spacer height="0.5em" />
    <Text>Source code</Text>
    <a href="https://github.com/kevinvanleer/covidmap">
      <Text fontSize="detail">https://github.com/kevinvanleer/covidmap</Text>
    </a>
    <a href="https://github.com/kevinvanleer/coviddata">
      <Text fontSize="detail">https://github.com/kevinvanleer/coviddata</Text>
    </a>
    <Spacer height="0.5em" />
    <Text fontSize="detail">Assembled by Kevin Van Leer</Text>
    <Spacer height="1em" />
    <Button id="covidmap-about-hide-self" onClick={onHide}>
      Dismiss
    </Button>
  </Flexbox>
);

About.propTypes = { onHide: PropTypes.func };