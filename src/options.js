import { getAllTabs } from 'lib/util';
import {render} from 'main';

render();

getAllTabs().then(tabs => {
  console.log('s水电费')
  console.log('tabs:', tabs)
});
