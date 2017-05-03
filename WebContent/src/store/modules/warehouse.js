/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import {
  newIdOfArray,
  currentDateTime,
  log} from '../../utils/utils';

import {
  initWarehouses
} from '../../db/init-data'

const state = {
  warehouses: [],
};

const getters = {
  warehouses: state => state.warehouses,
};

const mutations = {
  [types.INIT_WAREHOUSE] (state) {
    let warehouseObj = initWarehouses();
    state.warehouses = warehouseObj.warehouses;
  },
};

const actions = {
  initWarehouse ({commit}) {
    log('init supplier');
    commit(types.INIT_WAREHOUSE)
  },
  
};

export default {
  state,
  getters,
  mutations,
  actions
}
