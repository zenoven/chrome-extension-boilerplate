import { getAllTabs } from 'lib/util';
import {render} from 'main';

render();
getAllTabs().then(tabs => console.log('tabs:', tabs));

if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
