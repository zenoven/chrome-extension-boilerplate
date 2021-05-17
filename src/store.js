import persistPlugin from '@rematch/persist';
import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import * as models from 'models';
import { syncStorage } from 'redux-persist-webextension-storage';
import { clearStorage, c } from 'lib/util';

const persistConfig = {
  key: 'root',
  whitelist: ['readhub'],
  storage: syncStorage,
  throttle: 1000,
  version: 1,
  // debug: true,
};
const nestedPersistConfig = {
  readhub: {
    key: 'readhub',
    whitelist: ['readIds'],
    blackList: ['loading'],
    storage: syncStorage,
  }
}
// clearStorage(() => {
//   console.log('cleared');
// })

c.storage.sync.get(null, (value) => {
  console.log(value)
})

export default init({
  models,
  plugins: [
    immerPlugin(),
    persistPlugin(persistConfig, nestedPersistConfig),
  ],
});