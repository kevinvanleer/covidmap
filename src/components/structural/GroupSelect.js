import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flexbox, Text } from 'kvl-react-ui';

import { selectLayerGroup } from '../../state/ui/map';

export const GroupSelect = () => {
  const groups = useSelector((state) => state.ui.map.layerGroups);
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const dispatch = useDispatch();
  let maxLength = 0;

  groups.forEach(
    (group) => (maxLength = Math.max(group.layers.length, maxLength))
  );
  return (
    <Flexbox style={{ border: '1px solid #777' }} flexGrow={1}>
      {groups.map((group) => (
        <Flexbox
          flexGrow={1}
          key={group.name}
          minWidth={`${maxLength + 5}ch`}
          justifyContent="center"
          alignItems="center"
          backgroundColor={selectedGroup.name === group.name && '#777'}
        >
          <Text
            padding="0.2em"
            key={group.name}
            fontSize="detail"
            onClick={() => dispatch(selectLayerGroup(group))}
          >
            {group.name.toUpperCase()}
          </Text>
        </Flexbox>
      ))}
    </Flexbox>
  );
};
