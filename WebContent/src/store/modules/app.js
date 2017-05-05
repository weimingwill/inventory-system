import * as types from '../mutation-types'


const state = {
  sidebar: {
    opened: false,
    hidden: false
  }
};

const mutations = {
  [types.TOGGLE_SIDEBAR] (state, opened) {
    if (state.device.isMobile) {
      state.sidebar.opened = opened
    } else {
      state.sidebar.opened = true
    }
  },
};

export default {
  state,
  mutations
}
