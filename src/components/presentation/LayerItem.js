import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flexbox, Spacer, Text, SquareButton } from 'kvl-react-ui';
import { CompactLegend as Legend } from '../structural/CompactLegend.js';

export const LayerItem = styled(
  ({ className, onClick, config, active, collapsed }) => (
    <Flexbox alignItems="center" onClick={onClick}>
      <SquareButton
        id={`covidmap-button-layer-item-${config.label.toLowerCase()}`}
        onClick={onClick}
        backgroundColor={active ? '#777' : '#333'}
        title={config.label}
      >
        <FontAwesomeIcon
          size={collapsed ? 'sm' : 'lg'}
          icon={config.icon}
          color={active ? '#eee' : '#777'}
          fixedWidth
        />
      </SquareButton>
      {!collapsed ? (
        <>
          <Spacer width="0.5em" />
          <Flexbox flexDirection="column">
            <Text fontSize="label" bold={active} className={className}>
              {config.label}
            </Text>
            {config.gradient && <Legend {...config} />}
          </Flexbox>
        </>
      ) : null}
    </Flexbox>
  )
)`
  cursor: pointer;
`;
