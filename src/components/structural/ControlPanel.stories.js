import React from 'react';
import moment from 'moment';
import { faCat, faDog } from '@fortawesome/free-solid-svg-icons';
import { ControlPanel } from './ControlPanel.js';
import { covidData } from '../../test/caseData.js';

export default {
  component: ControlPanel,
  title: 'ControlPanel',
};

const layers = [
  { legend: { label: 'layer-1', icon: faCat }, id: 'layer-1' },
  { legend: { label: 'layer-2', icon: faDog }, id: 'layer-2' },
];

export const Basic = () => (
  <ControlPanel layers={[]} activeLayers={[]} detailsData={{}} date={{}} />
);
export const WithLayers = () => (
  <ControlPanel layers={layers} activeLayers={[]} detailsData={{}} date={{}} />
);

export const WithLayerOneSelected = () => (
  <ControlPanel
    layers={layers}
    activeLayers={['layer-1']}
    detailsData={{}}
    date={{}}
  />
);

export const Typical = () => (
  <ControlPanel
    layers={layers}
    activeLayers={['layer-1']}
    detailsData={{ displayName: 'Test data', data: covidData }}
    date={moment('2020-07-01')}
  />
);
