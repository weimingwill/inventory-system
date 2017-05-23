import * as types from '../mutation-types'
import { log } from '../../utils/utils'
import { initUsers } from '../../db/init-data'
import { USER_MENU } from '../../utils/setting'


const state = {
  loading: false,
  isNotRoot: true,
  users: [],
  user: {}
};

const getters = {
  loading: state => state.loading,

  verifyUser: state => (username, password) => {
    return state.users.find(user => user.username === username && user.password === password);
  },

  isNotRoot: state => state.isNotRoot,

  user: state => state.user,

  userMenus: (state, getters) => {
    if (Object.keys(state.user).length > 0) {
      let userMenu = USER_MENU[state.user.username];
      return getters.menuitems.filter(item => userMenu.includes(item.title));
    }
    return getters.menuitems;
  }
};

const mutations = {
  [types.INIT_APP] (state) {
    state.loading = false;

    let userObj = initUsers();
    state.users = userObj.users;

    if (localStorage.user) {
      state.user = JSON.parse(localStorage.user);
    }

    let url = window.location.href;
    if (url[url.length - 1] === '/') {
      state.isNotRoot = false
    }
  },
  
  [types.TOGGLE_LOADER] (state, loading) {
    if (loading !== undefined) {
      state.loading = loading
    } else {
      state.loading = !state.loading
    }
  },

  [types.TOGGLE_IS_ROOT] (state) {
    state.isNotRoot = !state.isNotRoot
  },

  [types.LOGIN] (state, user) {
    state.user = user;
    localStorage.user = JSON.stringify(user);
  },

  [types.LOGOUT] (state) {
    state.user = {};
    state.isNotRoot = false;
    localStorage.removeItem('user')
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
  },

  login ({commit}, user) {
    log('login');
    commit(types.LOGIN, user);
  },

  logout ({commit}) {
    log('logout');
    commit(types.LOGOUT);
  },

  toggleIsRoot ({commit}) {
    log('toggle isRoot');
    commit(types.TOGGLE_IS_ROOT);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
