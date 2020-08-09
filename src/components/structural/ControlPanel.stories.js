import React from 'react';
import moment from 'moment';
import { ControlPanel } from './ControlPanel.js';
import { covidData } from '../../test/caseData.js';

export default {
  component: ControlPanel,
  title: 'ControlPanel',
};

export const Basic = () => (
  <ControlPanel layers={[]} activeLayers={[]} detailsData={{}} date={{}} />
);
export const WithLayers = () => (
  <ControlPanel
    layers={[{ id: 'layer-1' }, { id: 'layer-2' }]}
    activeLayers={[]}
    detailsData={{}}
    date={{}}
  />
);

export const WithLayerOneSelected = () => (
  <ControlPanel
    layers={[{ id: 'layer-1' }, { id: 'layer-2' }]}
    activeLayers={['layer-1']}
    detailsData={{}}
    date={{}}
  />
);

export const Typical = () => (
  <ControlPanel
    layers={[{ id: 'layer-1' }, { id: 'layer-2' }]}
    activeLayers={['layer-1']}
    detailsData={{ displayName: 'Test data', data: covidData }}
    date={moment('2020-07-01')}
  />
);
