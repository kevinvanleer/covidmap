import styled from 'styled-components';

export const LoadingIndicator = styled.div`
  position: absolute;
  bottom: 1.5em;
  left: 1.5em;
  z-index: 10;
  font-size: 1.5em;
  transform-origin: bottom left;
  ${({ progress }) =>
    progress === 0
      ? `animation: pulse 2s ease infinite;`
      : `transform: scale(${1 - progress});
        transition: transform 1s ease-in-out;`}
  text-shadow: 0px 0px 2px #00e;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.02);
    }
    75% {
      transform: scale(0.98);
    }
  }
`;
