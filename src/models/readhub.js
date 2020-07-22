import { getTopics } from '../services/readhub';
export default {
  state: {
    topics: []
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    updateTopics(state, payload) {
      state.topics = payload;
    },
  },
  effects: {
    // handle state changes with impure functions.
    // use async/await for async actions
    async fetchTopics(payload, rootState) {
      let response = await getTopics() || [];
      this.updateTopics(response.data);
    },
  },
}