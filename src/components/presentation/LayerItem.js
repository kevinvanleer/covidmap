import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flexbox, Spacer, Text, SquareButton } from 'kvl-ui';

export const LayerItem = styled(({ className, onClick, config, active }) => (
  <Flexbox alignItems="center" onClick={onClick}>
    <SquareButton
      id={`covidmap-button-layer-item-${config.label.toLowerCase()}`}
      onClick={onClick}
      backgroundColor={active ? '#777' : '#333'}
    >
      <FontAwesomeIcon
        size="lg"
        icon={config.icon}
        color={active ? '#eee' : '#777'}
        fixedWidth
      />
    </SquareButton>
    <Spacer width="0.5em" />
    <Text fontSize="label" bold={active} className={className}>
      {config.label}
    </Text>
  </Flexbox>
))`
  cursor: pointer;
`;
