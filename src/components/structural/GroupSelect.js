import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flexbox, Text, Divider } from 'kvl-react-ui';

import { selectLayerGroup } from '../../state/ui/map';

export const GroupSelect = () => {
  const groups = useSelector((state) => state.ui.map.layerGroups);
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const dispatch = useDispatch();
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
            <Text
              centerAlign
              flexGrow={1}
              padding="0.2em"
              key={group.name}
              fontSize="detail"
              onClick={() => dispatch(selectLayerGroup(group))}
            >
              {group.name.toUpperCase()}
            </Text>
          </Flexbox>
          {idx !== groups.length - 1 && <Divider vertical />}
        </React.Fragment>
      ))}
    </Flexbox>
  );
};
