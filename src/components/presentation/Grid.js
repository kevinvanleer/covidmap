import styled from 'styled-components';

export const Grid = styled.div.attrs(() => ({ className: 'kvl-grid' }))`
  display: grid;
  ${({ flow, length, gap, rowGap }) =>
    flow === 'column'
      ? `
  grid-template-rows: repeat(${length}, auto);
  grid-auto-flow: column;
  grid-row-gap: ${gap};
  `
      : `
  grid-template-columns: repeat(${length}, auto);
  grid-auto-flow: row;
  grid-column-gap: ${gap};
  grid-row-gap: ${rowGap};
  `}
`;
