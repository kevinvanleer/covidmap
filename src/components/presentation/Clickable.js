import styled from 'styled-components';

import { Clickable as KvlClickable } from 'kvl-react-ui';

export const Clickable = styled(KvlClickable)`
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  align-items: center;
  text-align: center;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  flex-grow: ${(props) => props.flexGrow};
  text-decoration: none;
  appearance: none;
  padding: unset;
  box-sizing: unset;

  background-color: unset;
  color: unset;
`;
