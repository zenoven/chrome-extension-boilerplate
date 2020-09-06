import persistPlugin from '@rematch/persist';
import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import * as models from 'models';
import { syncStorage } from 'redux-persist-webextension-storage';

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
    storage: syncStorage,
  }
}

export default init({
  models,
  plugins: [
    immerPlugin(),
    persistPlugin(persistConfig, nestedPersistConfig),
  ],
});