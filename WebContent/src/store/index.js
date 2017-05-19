import Vue from 'vue'
import Vuex from 'vuex'
// import pkg from 'package'
import * as actions from './actions'
import * as getters from './getters'

import app from './modules/app'
import menu from './modules/menu'
import inventory from './modules/inventory'
import supplier from './modules/supplier'
import purchasing from './modules/purchasing'
import warehouse from './modules/warehouse'
import sales from './modules/sales'
import notifications from './modules/notifications'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  actions,
  getters,
  modules: {
    app,
    menu,
    inventory,
    supplier,
    purchasing,
    warehouse,
    sales,
    notifications
  },
  // strict: debug
});

export default store
