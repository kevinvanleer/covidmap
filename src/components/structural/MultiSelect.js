import React from 'react';
import PropTypes from 'prop-types';
import { Flexbox, Text, Divider } from 'kvl-react-ui';
import { Clickable } from '../presentation/Clickable';

export const MultiSelect = ({ groups, selectedGroup, onSelect }) => {
  let maxLength = 0;

  groups.forEach(
    (group) => (maxLength = Math.max(group.name.length, maxLength))
  );
  return (
    <Flexbox style={{ border: '1px solid #777' }} flexGrow={1}>
      {groups.map((group, idx) => (
        <React.Fragment key={`${group.name}-${idx}`}>
          <Clickable
            id={`covidmap-multiselect-item-${group.name.toLowerCase()}`}
            onClick={() => onSelect(group)}
            flexGrow={1}
          >
            <Flexbox
              flexGrow={1}
              minWidth={`${maxLength}ch`}
              justifyContent="center"
              alignItems="center"
              backgroundColor={selectedGroup.name === group.name && '#777'}
            >
              <Text centerAlign padding="0.2em" fontSize="detail">
                {group.name.toUpperCase()}
              </Text>
            </Flexbox>
          </Clickable>
          {idx !== groups.length - 1 && <Divider vertical />}
        </React.Fragment>
      ))}
    </Flexbox>
  );
};

MultiSelect.propTypes = {
  groups: PropTypes.array,
  selectedGroup: PropTypes.object,
  onSelect: PropTypes.func,
};
