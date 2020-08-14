import styled from 'styled-components';

export const LoadingIndicator = styled.div`
  transform-origin: bottom left;
  ${({ progress }) =>
    progress === 0
      ? `animation: pulse 2s ease infinite;`
      : `transform: scale(${1 - progress});
        transition: transform 1s ease-in-out;`}

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
