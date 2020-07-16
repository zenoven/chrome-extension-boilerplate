import {render} from 'main';

render();

if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}

