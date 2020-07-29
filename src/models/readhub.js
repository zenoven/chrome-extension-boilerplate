import { getTopics } from '../services/readhub';
export default {
  state: {
    topics: []
  },
  reducers: {
    updateTopics(state, payload) {
      state.topics = payload;
    },
  },
  effects: {
    async fetchTopics(payload, rootState) {
      let response = await getTopics() || [];
      this.updateTopics(response.data);
    },
  },
}