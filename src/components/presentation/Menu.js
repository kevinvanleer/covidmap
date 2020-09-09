import styled from 'styled-components';
import { Flexbox } from 'kvl-react-ui';

export const Menu = styled(Flexbox)`
  text-decoration: none;
  cursor: pointer;

  & > *:hover {
    background-color: #777;
  }
`;

Menu.defaultProps = {
  flexDirection: 'column',
};
