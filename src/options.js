import { getAllTabs } from 'lib/util';

getAllTabs().then(tabs => console.log('tabs:', tabs));