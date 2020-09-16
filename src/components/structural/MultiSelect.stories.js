import React from 'react';
import { MultiSelect } from './MultiSelect.js';

export default {
  component: MultiSelect,
  title: 'MultiSelect',
};

export const Default = () => (
  <MultiSelect
    selectedGroup={{ name: 'A' }}
    groups={[{ name: 'A' }, { name: 'b' }, { name: 'AbCd' }]}
  />
);
