import React from 'react';
import ReactDOM from 'react-dom';
import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import * as models from 'models';
import { Provider } from 'react-redux';
import APP from 'views/app';

const immer = immerPlugin();
const store = init({
  models,
  plugins: [immer],
});

export const render = (path) => {
  ReactDOM.render(
    (
      <Provider store={store}>
        <APP path={path} />
      </Provider>
    ),
    document.getElementById('app')
  );
}

export default { render };
