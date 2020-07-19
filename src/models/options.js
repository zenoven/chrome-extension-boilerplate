export default {
  state: {
    count: 1
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    add(state, payload) {
      state.count += payload;
    },
  },
  effects: {
    // handle state changes with impure functions.
    // use async/await for async actions
    async addAsync(payload, rootState) {
      console.log(rootState)
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.add(payload)
    },
  },
}