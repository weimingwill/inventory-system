import * as types from '../mutation-types'
import { log } from '../../utils/utils'

const state = {
  loading: false
};

const getters = {
  loading: state => state.loading
};

const mutations = {
  [types.INIT_APP] (state) {
    state.loading = false;
  },
  
  [types.TOGGLE_LOADER] (state, loading) {
    if (loading !== undefined) {
      state.loading = loading
    } else {
      state.loading = !state.loading
    }
  }
};

const actions = {
  initApp ({commit}) {
    log('init app');
    commit(types.INIT_APP)
  },
  
  toggleLoader ({commit}) {
    log('toggle loader');
    commit(types.TOGGLE_LOADER);
  },
  
  setLoader ({commit}, loading) {
    log('set loader');
    commit(types.TOGGLE_LOADER, loading);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
