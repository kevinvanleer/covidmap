import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flexbox, Spacer, Text, SquareButton } from 'kvl-ui';

export const ToggleButton = ({ id, onClick, icon, active }) => (
  <SquareButton
    id={id}
    onClick={onClick}
    backgroundColor={active ? '#777' : '#333'}
  >
    <FontAwesomeIcon icon={icon} color={active ? '#eee' : '#777'} fixedWidth />
  </SquareButton>
);
