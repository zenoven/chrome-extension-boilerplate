import { getAllTabs, windows, c } from 'lib/util';

getAllTabs().then(tabs => console.log('tabs:', tabs))