/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import {
  newIdOfArray,
  currentDateTime,
  getFirstCharOfEachWord,
  log} from '../../utils/utils';

import {
  initPurchasing,
} from '../../db/init-data'

const state = {
  purchaseOrders: [],
  warehouses: []
};

const getters = {
  purchaseOrders: state => state.purchaseOrders,

  getOrderByNumber: (state, getters) => (orderNumber) => state.purchaseOrders.find((order) => order.orderNumber === orderNumber),
  
  getTotalReceiveQuantity: (state, getters) => (orderNumber) => {
    let order = getters.getOrderByNumber(orderNumber);
    return order.variants.map(variant => variant.receivedQuantity).reduce((sum, quantity) => {
      return sum + quantity;
    });
  },

  getTotalQuantity: (state, getters) => (orderNumber) => {
    let order = getters.getOrderByNumber(orderNumber);
    return order.variants.map(variant => variant.quantity).reduce((sum, quantity) => {
      return sum + quantity;
    });
  },

  getTotalCost: (state, getters) => (orderNumber) => {
    let order = getters.getOrderByNumber(orderNumber);
    return order.variants.map(variant => {
      return variant.quantity * getters.getVariantById(variant.variantId).costPrice
    }).reduce((sum, cost) => {
      return sum + cost;
    });
  },

};

const mutations = {
  [types.INIT_PURCHASING] (state) {
    let purchasing = initPurchasing();
    log(purchasing)
    state.purchaseOrders = purchasing.purchaseOrders;
  
    // let warehouseObjects = initWarehouses();
    // state.warehouses = warehouseObjects.warehouses
  }
};

const actions = {
  initPurchasing ({commit}) {
    log('init purchasing');
    commit(types.INIT_PURCHASING)
  },
  
};

export default {
  state,
  getters,
  mutations,
  actions
}
