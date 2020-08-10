import React from 'react';
import styled from 'styled-components';
import { Flexbox, Spacer, Text } from 'kvl-ui';

export const LayerItem = styled(({ className, onClick, label, active }) => (
  <Flexbox alignItems="center" onClick={onClick}>
    <input type="checkbox" checked={active} readOnly />
    <Spacer width="0.5em" />
    <Text fontSize="label" bold={active} className={className}>
      {label}
    </Text>
  </Flexbox>
))`
  cursor: pointer;
`;
