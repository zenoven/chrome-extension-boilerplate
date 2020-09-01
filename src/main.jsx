import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'react-redux';
import APP from 'views/app';

export const render = (path) => {
  document.documentElement.classList.add(`page-${path}`)
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
