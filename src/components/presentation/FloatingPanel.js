import styled from 'styled-components';
import { Flexbox } from 'kvl-react-ui';

export const FloatingPanel = styled(Flexbox)`
  position: absolute;
  & > * {
    flex-shrink: 0;
  }
`;

FloatingPanel.defaultProps = {
  zIndex: 10,
  flexDirection: 'column',
  backgroundColor: '#444',
  color: '#eee',
  padding: '1em',
};
