import { getAllTabs } from 'lib/util';

getAllTabs().then(tabs => {
  console.log('s')
  console.log('tabs:', tabs)
});

if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}