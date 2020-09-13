import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flexbox, Text, Divider, Button } from 'kvl-react-ui';

import { selectLayerGroup } from '../../state/ui/map';

export const GroupSelect = () => {
  const groups = useSelector((state) => state.ui.map.layerGroups);
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const dispatch = useDispatch();

  const onSelectLayerGroup = useCallback(
    (group) => dispatch(selectLayerGroup(group)),
    [dispatch]
  );

  let maxLength = 0;

  groups.forEach(
    (group) => (maxLength = Math.max(group.name.length, maxLength))
  );
  return (
    <Flexbox style={{ border: '1px solid #777' }} flexGrow={1}>
      {groups.map((group, idx) => (
        <React.Fragment key={`${group.name}-${idx}`}>
          <Flexbox
            flexGrow={1}
            minWidth={`${maxLength}ch`}
            justifyContent="center"
            alignItems="center"
            backgroundColor={selectedGroup.name === group.name && '#777'}
          >
            <Button
              id={`covidmap-groupselect-${group.name.toLowerCase()}`}
              onClick={() => onSelectLayerGroup(group)}
            >
              <Text
                centerAlign
                flexGrow={1}
                padding="0.2em"
                key={group.name}
                fontSize="detail"
              >
                {group.name.toUpperCase()}
              </Text>
            </Button>
          </Flexbox>
          {idx !== groups.length - 1 && <Divider vertical />}
        </React.Fragment>
      ))}
    </Flexbox>
  );
};
