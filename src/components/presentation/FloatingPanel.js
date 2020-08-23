import styled from 'styled-components';
import { Flexbox } from 'kvl-react-ui';

export const FloatingPanel = styled(Flexbox)`
  position: absolute;
`;

FloatingPanel.defaultProps = {
  zIndex: 10,
  flexDirection: 'column',
  backgroundColor: '#444',
  color: '#eee',
  padding: '1em',
};
