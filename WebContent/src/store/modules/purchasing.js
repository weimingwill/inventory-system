/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import {
  newIdOfArray,
  currentDateTime,
  getFormatedDate,
  getFirstCharOfEachWord,
  log} from '../../utils/utils';

import {
  initPurchasing,
} from '../../db/init-data'

import {
  addPurchaseOrder
} from '../../db/purchasing'

import * as s from '../../utils/setting'

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
  
  getNewOrderNumber: (state) => {
    let orderNumberDigits = state.purchaseOrders.map(p => parseInt(p.orderNumber.charAt(p.orderNumber.length - 1)));
    let newOrderNumberDigit = Math.max.apply(Math, orderNumberDigits) + 1;
    return `P0000${newOrderNumberDigit}`;
  }
};

const mutations = {
  [types.INIT_PURCHASING] (state) {
    let purchasing = initPurchasing();
    log(purchasing)
    state.purchaseOrders = purchasing.purchaseOrders;
  },
  
  [types.ADD_PURCHASE] (state, {order, items}) {
    let purchaseOrder = {};
    Array.from(s.PURCHASE_ORDER_ATTR).forEach(attr => {
      if (order.hasOwnProperty(attr)) {
        purchaseOrder[attr] = order[attr];
      } else {
        purchaseOrder[attr] = ""
      }
    });

    let datetime = currentDateTime();
    let date = new Date();
    date.setDate(date.getDate() + 7);
    let due = getFormatedDate(date);

    purchaseOrder.id = newIdOfArray(state.purchaseOrders);
    purchaseOrder.variants = [];
    purchaseOrder.created = datetime;
    purchaseOrder.updated = datetime;
    purchaseOrder.due = due;
    purchaseOrder.isReceived = false;
    
    Array.from(items).forEach(item => {
      let variant = {};
      variant.variantId = item.id;
      variant.quantity = parseInt(item.quantity);
      variant.adjustCost = "";
      variant.adjustQuantity = "";
      variant.adjustReason = "";
      variant.adjusted = false;
      variant.receivedAt = "";
      variant.receivedQuantity = 0;
      purchaseOrder.variants.push(variant);
    });
    
    log(purchaseOrder);
    addPurchaseOrder(purchaseOrder);
    
    // Todo: bug with variant number in display (add? or display? )
  }
};

const actions = {
  initPurchasing ({commit}) {
    log('init purchasing');
    commit(types.INIT_PURCHASING)
  },
  
  createPurchase ({dispatch}, {order, items}) {
    log('create purchase');
    order.status = "purchased";
    dispatch('addPurchase', {order, items})
  },
  
  savePurchase ({dispatch}, {order, items}) {
    log('save purchase');
    order.status = "drafted";
    dispatch('addPurchase', {order, items})
  },
  
  addPurchase ({commit, getters}, {order, items}) {

    log('add purchase');
    order.supplierId = getters.getObjectByAttr(
      s.MODULE_SUPPLIER, s.OBJ_SUPPLIER, 'name', order.supplier).id;
    
    order.supplierContactId = getters.getObjectByAttr(
      s.MODULE_SUPPLIER, s.OBJ_SUPPLIER_CONTACTS, 'email', order.contact).id;
    
    order.warehouseId = getters.getObjectByAttr(
      s.MODULE_WAREHOUSE, s.OBJ_WARHEOUSE, 'location', order.warehouse).id;
    
    // Todo calculate due date
    commit(types.ADD_PURCHASE, {order, items});
  },
  
  
};

export default {
  state,
  getters,
  mutations,
  actions
}
