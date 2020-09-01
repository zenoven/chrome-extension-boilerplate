import { getTopics } from '../services/readhub';
const defaultPageSize = 20;
import { c } from 'lib/util';
export default {
  state: {
    topics: [],
    readIds: [],
    loading: false,
    viewingId: null,
  },
  reducers: {
    updateTopics(state, payload) {
      let { data, lastCursor } = payload;
      let topics = state.topics.length && lastCursor ? state.topics.concat(data) : data;
      state.topics = topics;
      return state;
    },
    markRead(state, payload) {
      let ids = state.readIds.slice();
      if (!state.readIds.includes(payload)) {
        ids.push(payload);
      }
      state.readIds = ids;
      return state;
      // c.storage.sync.get('readhub', x => console.log('readhub:', x));
    },
    updateViewingId(state, payload) {
      // state.viewingId = payload;
      return { ...state, viewingId: payload};
    },
    toggleLoading(state, payload) {
      state.loading = payload;
      return state;
    }
  },
  effects: {
    async fetchTopics(payload = {}, rootState) {
      let {
        readhub: {
          topics,
          loading,
        }
      } = rootState;
      if (loading) return;
      this.toggleLoading(true);
      let lastCursor = '';
      if (topics.length) {
        lastCursor = topics[topics.length - 1].order;
      }
      payload.lastCursor = lastCursor;
      if (!payload.pageSize) {
        payload.pageSize = defaultPageSize;
      }
      let response = await getTopics(payload) || [];
      this.updateTopics({ data: response.data, lastCursor });
      this.toggleLoading(false);
    },
  },
}