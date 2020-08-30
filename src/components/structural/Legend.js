import React from 'react';
import PropTypes from 'prop-types';

import { Flexbox, Text } from 'kvl-react-ui';

const prettyPrint = (number) => {
  if (number >= 1e6) {
    return `${number / 1e6}M`;
  }
  if (number >= 1e3) {
    return `${number / 1e3}k`;
  }
  return number;
};

const boxDimension = '1.5rem';

export const Legend = ({ fillColor, gradient }) => (
  <Flexbox flexDirection="column" color="#222" backgroundColor="#eee">
    <Flexbox flexDirection="row">
      {gradient.map((step) => (
        <Flexbox
          key={step.magnitude}
          height={boxDimension}
          width={boxDimension}
          backgroundColor={step.color || fillColor}
          opacity={step.opacity}
        />
      ))}
    </Flexbox>
    <Flexbox flexDirection="row">
      {gradient.map((step) => (
        <Text
          key={step.magnitude}
          fontSize="0.6rem"
          color="#222"
          centerAlign
          width={boxDimension}
        >
          {prettyPrint(step.magnitude)}
        </Text>
      ))}
    </Flexbox>
  </Flexbox>
);

Legend.propTypes = {
  fillColor: PropTypes.string,
  gradient: PropTypes.array,
};
