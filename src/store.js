import persistPlugin from '@rematch/persist';
import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import * as models from 'models';
import { syncStorage, localStorage } from 'redux-persist-webextension-storage';
import storage from 'redux-persist/lib/storage';

const immer = immerPlugin();
const persistConfig = {
  key: 'readhub',
  // whitelist: ['readhub'],
  // storage: syncStorage,
  storage: storage,
  throttle: 2000,
  version: 1,
  debug: true,
}

export default init({
  models,
  plugins: [persistPlugin(persistConfig), immer],
});