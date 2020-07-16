import { hot } from 'react-hot-loader/root';
import React from 'react';
import { init } from '@rematch/core';
import * as models from '../models';
import { Provider } from 'react-redux';
import Options from 'views/options';
const store = init({
  models,
});


const APP = () => {
  return (
    <Provider store={store}>
      <div><Options></Options></div>
    </Provider>
  )
};

export default hot(APP);