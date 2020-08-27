import React from 'react';
import PropTypes from 'prop-types';
import Color from 'color';

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

export const CompactLegend = ({ fillColor, gradient }) => (
  <Flexbox flexDirection="row" backgroundColor="#eee">
    {gradient.map((step) => (
      <Text
        key={step.magnitude}
        height="0.6rem"
        width={boxDimension}
        backgroundColor={Color(fillColor).alpha(step.opacity)}
        alignItems="center"
        fontSize="0.5rem"
        color={step.opacity < 0.5 ? '#000' : '#eee'}
        centerAlign
      >
        {prettyPrint(step.magnitude)}
      </Text>
    ))}
  </Flexbox>
);

CompactLegend.propTypes = {
  fillColor: PropTypes.string,
  gradient: PropTypes.array,
};
