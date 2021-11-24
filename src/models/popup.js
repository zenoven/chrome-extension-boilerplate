export default {
  state: {
    activeKey: 'readhub',
    loadedKeys: ['readhub'],
    urls: {}
  },
  reducers: {
    updateActiveKey(state, payload) {
      state.activeKey = payload;
      return state;
    },
    markTabLoaded(state, payload) {
      if (!state.loadedKeys.includes(payload)) {
        state.loadedKeys.push(payload);
      }
      return state;
    }
  },
}