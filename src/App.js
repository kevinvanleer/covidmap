import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

//import { fetchUsCovidByCounty } from './workflows/fetchCovidData.js';
//import { fetchUsCasesByCounty } from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

function App() {
  const dispatch = useDispatch();
  //useEffect(() => dispatch(fetchUsCovidByCounty()));
  //dispatch(fetchUsCasesByCounty());
  return <FullscreenMap />;
}

export default App;
