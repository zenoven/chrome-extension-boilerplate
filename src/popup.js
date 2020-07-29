import {render} from 'main';

render('popup');

if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}

