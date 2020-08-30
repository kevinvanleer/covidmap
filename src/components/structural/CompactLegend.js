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

export const CompactLegend = ({ fillColor, gradient }) => {
  const darkText = '#111';
  const lightText = '#eee';

  return (
    <Flexbox flexDirection="row" backgroundColor="#eee">
      {gradient.map((step) => {
        const backgroundColor = Color(step.color || fillColor);
        const effectiveBackgroundColor = Color(
          backgroundColor.array().map((dim) => 238 - step.opacity * (238 - dim))
        );
        const darkTextContrast = effectiveBackgroundColor.contrast(
          Color(darkText)
        );
        const lightTextContrast = effectiveBackgroundColor.contrast(
          Color(lightText)
        );
        return (
          <Text
            key={step.magnitude}
            height="0.6rem"
            width={boxDimension}
            backgroundColor={backgroundColor.alpha(step.opacity)}
            alignItems="center"
            fontSize="0.5rem"
            color={darkTextContrast > lightTextContrast ? darkText : lightText}
            centerAlign
            flexGrow={1}
          >
            {prettyPrint(step.magnitude)}
          </Text>
        );
      })}
    </Flexbox>
  );
};

CompactLegend.propTypes = {
  fillColor: PropTypes.string,
  gradient: PropTypes.array,
};
