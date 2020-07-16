export default {
  state: {
    count: 1
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    increment(state, payload) {
      let count = state.count + payload;
      return { ...state, count};
    },
  },
  effects: {
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync(payload, rootState) {
      console.log(rootState)
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.increment(payload)
    },
  },
}