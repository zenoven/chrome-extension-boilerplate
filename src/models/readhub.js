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
      state.topics = state.topics.length && lastCursor ? state.topics.concat(data) : data;
      return state;
    },
    markRead(state, payload) {
      if (!state.readIds.includes(payload)) {
        state.readIds.push(payload);
      }
      return state;
    },
    updateViewingId(state, payload) {
      state.viewingId = payload;
      return state;
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