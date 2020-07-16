import { getAllTabs } from 'lib/util';

getAllTabs().then(tabs => {
  console.log('hello:', tabs);
})

if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}