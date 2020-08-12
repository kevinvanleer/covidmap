import styled from 'styled-components';

export const Link = styled.a`
  color: ${(props) => props.color};
  text-decoration: none;

  &:visited {
    color: ${(props) => props.color};
  }

  &:hover {
    color: cyan;
  }

  &:active {
    color: #1790a7;
  }

  &:focus {
    color: cyan;
  }
`;

Link.defaultProps = {
  color: '#38c9e4',
};
