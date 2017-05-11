/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import {
  newIdOfArray,
  currentDateTime,
  getFormatedDate,
  getDateRangeOfWeek,
  getFirstCharOfEachWord,
  log} from '../../utils/utils';

import {
  initPurchasing
} from '../../db/init-data'

import {
  addPurchaseOrder
} from '../../db/purchasing'

import * as s from '../../utils/setting'

const state = {
  purchaseOrders: []
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
  },
  
  purchaseOrderSuppliers: (state, getters) => {
    return state.purchaseOrders.filter(order => order.status === s.STATUS_PURCHASED).map(p => {
      return getters.getSupplierById(p.supplierId);
    })
  },
  
  quantityBySupplier: (state) => (supplierId) => {
    return state.purchaseOrders.filter(
      order => order.status === s.STATUS_PURCHASED && order.supplierId === supplierId).map(
        p => p.quantity).reduce((sum, quantity) => {
      return sum + quantity;
    });
  },
  
  getDashboardInfo: (state, getters) => {
    let totalUnits = 0;
    let totalCost = 0;
    let currPurchaseUnits = 0;
    let lastWeekPurchaseUnits = 0;
    let currCost = 0;
    let lastWeekCost = 0;
    let preTotalUnits = 0;
    let preTotalCost = 0;
    
    Array.from(state.purchaseOrders).forEach(order => {
      let purchaseDate = new Date(order.created);
      let dateRange = getDateRangeOfWeek(purchaseDate);
      let quantity = order.quantity;
      let cost = order.cost;
      if (dateRange.monday < purchaseDate < dateRange.sunday) {
        currPurchaseUnits += quantity;
        currCost += cost;
      } else if (dateRange.lastMonday < purchaseDate < dateRange.lastSunday) {
        lastWeekPurchaseUnits += quantity;
        lastWeekCost += cost;
      }
      
      if (purchaseDate < dateRange.monday) {
        preTotalUnits += quantity;
        preTotalCost += cost;
      }
      totalUnits += quantity;
      totalCost += cost;
    })
    
    let avgUnitCost = totalCost / totalUnits;
    let avgPreCost = preTotalCost / preTotalUnits;
    let info = [];
    let values = [currPurchaseUnits, currCost, Math.round(avgUnitCost)];
    let percentage = [
      Math.round((currPurchaseUnits - lastWeekPurchaseUnits) / lastWeekPurchaseUnits * 100),
      Math.round((currCost - lastWeekCost) / lastWeekCost  * 100),
      Math.round((avgUnitCost - avgPreCost) / avgPreCost * 100)
    ]
    
    for (let i = 0; i < 3; i++) {
      let data = {}
      data.id = i + 1;
      data.title = s.PURCHASING_DASHBOARD_TITLES[i];
      data.unit = s.PURCHASING_DASHBOARD_UNITS[i];
      data.isIncreased = percentage[i] > 0;
      data.percentage = percentage[i];
      data.value = values[i];
      info.push(data);
    }
    
    log(info);
    return info
  },
};

const mutations = {
  [types.INIT_PURCHASING] (state) {
    let purchasing = initPurchasing();
    // state.purchaseOrders = purchasing.purchaseOrders;
  
    state.purchaseOrders = purchasing.purchaseOrders.map(p => {
      p.quantity = p.variants.map(variant => variant.quantity).reduce((sum, quantity) => {
        return sum + quantity;
      });
      
      p.cost = p.variants.map(variant => {
        return variant.quantity * variant.price
      }).reduce((sum, cost) => {
        return sum + cost;
      });
      
      return p;
    })
    
    log(state.purchaseOrders)
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
  initPurchasing ({commit, getters}) {
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
      s.MODULE_WAREHOUSE, s.OBJ_WAREHOUSE, 'location', order.warehouse).id;

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
