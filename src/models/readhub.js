import { getTopics } from '../services/readhub';
export default {
  state: {
    topics: [],
    status: {
      read: [],
    }
  },
  reducers: {
    updateTopics(state, payload) {
      state.topics = payload;
    },
    markRead(state, payload) {
      if (!state.status.read.includes(payload)) {
        state.status.read.push(payload);
      }
    },
  },
  effects: {
    async fetchTopics(payload, rootState) {
      let response = await getTopics() || [];
      this.updateTopics(response.data);
    },
  },
}