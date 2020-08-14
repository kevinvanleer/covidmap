import React from 'react';
import { Legend } from '.';
import { FloatingPanel } from '../presentation/FloatingPanel';

export const LegendBox = () => {
  const legendConfig = [
    {
      name: 'Deaths',
      color: '#f00',
      gradient: [
        {
          magnitude: 10,
          opacity: 0.2,
        },
        {
          magnitude: 100,
          opacity: 0.4,
        },
        {
          magnitude: 1000,
          opacity: 0.7,
        },
        {
          magnitude: 2000,
          opacity: 0.8,
        },
      ],
    },
    {
      name: 'Cases',
      color: '#00f',
      gradient: [
        {
          magnitude: 10,
          opacity: 0.1,
        },
        {
          magnitude: 100,
          opacity: 0.2,
        },
        {
          magnitude: 10000,
          opacity: 0.4,
        },
        {
          magnitude: 200000,
          opacity: 0.8,
        },
      ],
    },
  ];
  return (
    <FloatingPanel
      flexDirection="row"
      width="min-content"
      backgroundColor="transparent"
      zIndex={50}
      position="absolute"
      right="calc(50% - 96px)"
      bottom="0"
      padding="0"
      marginBetween="1.5em"
    >
      {legendConfig.map((cfg) => (
        <Legend key={cfg.name} fillColor={cfg.color} gradient={cfg.gradient} />
      ))}
    </FloatingPanel>
  );
};
