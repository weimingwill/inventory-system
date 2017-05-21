/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import {
  newIdOfArray,
  currentDateTime,
  getFormatedDate,
  getDateRangeOfWeek,
  setSameAttributeValues,
  removeArrayDuplicates,
  calculateHasDoneQuantity,
  log} from '../../utils/utils';

import {
  initPurchasing,
  initRecommendation
} from '../../db/init-data'

import {
  addPurchaseOrder,
  updatePurchaseOrder,
  udpateRecommendation
} from '../../db/purchasing'

import * as s from '../../utils/setting'

const state = {
  purchaseOrders: [],
  recommendations: []
};

const getters = {
  purchaseOrders: state => state.purchaseOrders,

  recommendations: state => state.recommendations,

  getOrderByNumber: (state, getters) => (orderNumber) => state.purchaseOrders.find((order) => order.orderNumber === orderNumber),

  receivedQuantityPercentage: (state, getters) => (orderNumber) => {
    return (getters.totalReceivedQuantity(orderNumber) / getters.getTotalQuantity(orderNumber)).toFixed(2) * 100;
  },
  
  totalReceivedQuantity: (state, getters) => (orderNumber) => {
    let order = getters.getOrderByNumber(orderNumber);
    if (order.receives.length > 0) {
      return order.receives.map(item => item.variants.map(variant => variant.quantity).reduce((sum, quantity) => {
        return sum + quantity;
      })).reduce((sum, quantity) => {
        return sum + quantity;
      });
    } else {
      return 0;
    }
  },
  
  // Get total received quantity of purchase order
  getTotalReceiveQuantity: (state, getters) => (orderNumber) => {
    let order = getters.getOrderByNumber(orderNumber);
    return order.variants.map(variant => variant.receivedQuantity).reduce((sum, quantity) => {
      return sum + quantity;
    });
  },

  // Get total quantity of a purchase order
  getTotalQuantity: (state, getters) => (orderNumber) => {
    let order = getters.getOrderByNumber(orderNumber);
    return order.variants.map(variant => variant.quantity).reduce((sum, quantity) => {
      return sum + quantity;
    });
  },

  // Get total cost of a purchase order
  getTotalCost: (state, getters) => (orderNumber) => {
    let order = getters.getOrderByNumber(orderNumber);
    return order.variants.map(variant => {
      return variant.quantity * getters.getVariantById(variant.variantId).costPrice
    }).reduce((sum, cost) => {
      return sum + cost;
    });
  },

  // Generate new order number based on existing purchase orders' order number
  getNewOrderNumber: (state) => {
    let orderNumberDigits = state.purchaseOrders.map(p => parseInt(p.orderNumber.charAt(p.orderNumber.length - 1)));
    let newOrderNumberDigit = Math.max.apply(Math, orderNumberDigits) + 1;
    return `P0000${newOrderNumberDigit}`;
  },
  
  // Get purchase order suppliers
  purchaseOrderSuppliers: (state, getters) => {
    let supplierIds = state.purchaseOrders.filter(order => order.status === s.STATUS_PURCHASED).map(p => p.supplierId);
    supplierIds = removeArrayDuplicates(supplierIds);
    return supplierIds.map(supplierId => {
      return getters.getSupplierById(supplierId);
    });
  },

  // Get purchase order variants of supplier
  purchaseOrderVariantsBySupplierName: (state, getters) => (supplierName) => {
    let purchaseOrders = state.purchaseOrders.filter(p => p.supplierId === getters.getSupplierByName(supplierName).id)
    let variants = [];
    Array.from(purchaseOrders).forEach(p => {
      variants = variants.concat(p.variants)
    });

    variants.map(v => {
      let variant = getters.getVariantById(v.variantId);
      v.name = variant.name;
      v.cost = variant.costPrice * v.quantity;
      return v;
    });

    return variants;
  },

  // Get incoming stock purchase quantity of supplier
  quantityBySupplier: (state) => (supplierId) => {
    return state.purchaseOrders.filter(
      order => order.status === s.STATUS_PURCHASED && order.supplierId === supplierId).map(
        p => p.quantity).reduce((sum, quantity) => {
      return sum + quantity;
    });
  },

  // Get incoming stock purchase cost of supplier
  costBySupplier: (state) => (supplierId) => {
    return state.purchaseOrders.filter(
      order => order.status === s.STATUS_PURCHASED && order.supplierId === supplierId).map(
        p => p.cost).reduce((sum, cost) => {
      return sum + cost;
    });
  },

  // Get information for top 3 metrics in purchasing dashboard
  // 1. Total purchase units
  // 2. Total purchase costs
  // 3. Avg unit cost
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
    });
    
    let avgUnitCost = totalCost / totalUnits;
    let avgPreCost = preTotalCost / preTotalUnits;
    let info = [];
    let values = [currPurchaseUnits, currCost, Math.round(avgUnitCost)];
    let percentage = [
      Math.round((currPurchaseUnits - lastWeekPurchaseUnits) / lastWeekPurchaseUnits * 100),
      Math.round((currCost - lastWeekCost) / lastWeekCost  * 100),
      Math.round((avgUnitCost - avgPreCost) / avgPreCost * 100)
    ];
    
    for (let i = 0; i < 3; i++) {
      let data = {};
      data.id = i + 1;
      data.title = s.PURCHASING_DASHBOARD_TITLES[i];
      data.unit = s.PURCHASING_DASHBOARD_UNITS[i];
      data.isIncreased = percentage[i] > 0;
      data.percentage = percentage[i] === Infinity? 0 : percentage[i];
      data.value = values[i];
      info.push(data);
    }
    
    log(info);
    return info
  },

  getDashboardAction: (state, getters) => {
    let actions = []
      , action;

    action = {
      id: 'to-purchase',
      title: 'To Purchase',
      number: getters.toPurchaseNew.length,
      unit: 'Recommendations',
      href: '/recommendations'
    };

    actions.push(action);

    action = {
      id: 'to-reorder',
      title: 'To Reorder',
      number: getters.toReorder.length,
      unit: 'Recommendations',
      href: '/reorder'
    };

    actions.push(action);

    action = {
      id: 'to-adjust',
      title: 'To Adjust',
      number: getters.toAdjust.length,
      unit: 'Purcahse Orders',
      href: '/purchaseOrder/adjustments'
    };

    actions.push(action);

    return actions;
  },


  // Recommendations
  toPurchaseNew: state => state.recommendations.filter(r => r.type === 'new'),

  toReorder: state => state.recommendations.filter(r => r.type === 'reorder'),

  toAdjust: state => state.purchaseOrders.filter(p => p.adjustments.length > 0),

  getRecommendationByNumber: state => (number) => state.recommendations.find(r => r.number === number),

  // Get statuses
  getInboundStatuses() {
    return [s.ALL, s.STATUS_PURCHASED, s.STATUS_RECEIVED, s.STATUS_CHECKED, s.STATUS_STORED]
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
        return variant.quantity * variant.costPrice
      }).reduce((sum, cost) => {
        return sum + cost;
      });

      // For data load from csv file
      if (!p.hasOwnProperty('toReceives')) {
        let variants  = p.variants.slice();
        p.toReceives = variants.map(variant => {
          variant.toReceive = variant.quantity;
          return Object.assign({}, variant);
        });
        p.receives = [];
        p.adjustments = [];
        p.toChecks = [];
        p.checkedItems = [];
        p.toStores = [];
        p.storedItems = [];
      }
      return p;
    });

    let recommendationObj = initRecommendation();
    state.recommendations = recommendationObj.recommendations.map(r => {
      r.quantity = r.variants.map(v => v.quantity).reduce((sum, quantity) => { return sum + quantity });
      return r;
    });

    state.purchaseOrders.sort((a, b) => a.created - b.created);

    log('purchaseOrders', state.purchaseOrders);
  },

  [types.ADD_PURCHASE] (state, {order, items}) {
    let purchaseOrder = setSameAttributeValues(order, s.PURCHASE_ORDER_ATTR);

    let datetime = currentDateTime();
    let date = new Date();
    date.setDate(date.getDate() + 7);
    let due = getFormatedDate(date);

    purchaseOrder.id = newIdOfArray(state.purchaseOrders);
    purchaseOrder.variants = [];
    purchaseOrder.created = datetime;
    purchaseOrder.updated = datetime;
    purchaseOrder.due = due;
    purchaseOrder.received = false;

    let variants = [];

    Array.from(items).forEach(item => {
      let variant = {};
      variant.variantId = item.id;
      variant.quantity = parseInt(item.quantity);
      variant.costPrice = item.costPrice;
      // variant.adjustCost = "";
      // variant.adjustQuantity = "";
      // variant.adjustReason = "";
      // variant.adjusted = false;
      // variant.receivedAt = "";
      // variant.receivedQuantity = 0;
      variants.push(variant);
    });

    purchaseOrder.variants = variants;
    
    purchaseOrder.cost = variants.map(v => {
      return v.quantity * v.costPrice
    }).reduce((sum, cost) => {
      return sum + cost
    });
    
    purchaseOrder.toReceives = variants.slice(0).map(variant => {
      variant.toReceive = variant.quantity;
      return variant;
    });
    purchaseOrder.receives = [];
    purchaseOrder.adjustments = [];
    purchaseOrder.receivedPercentage = 0;
    purchaseOrder.checkedPercentage = 0;
    purchaseOrder.storedPercentage = 0;
    purchaseOrder.toChecks = [];
    purchaseOrder.checkedItems = [];
    purchaseOrder.toStores = [];
    purchaseOrder.storedItems = [];
    
    log(purchaseOrder);
    addPurchaseOrder(purchaseOrder);

    // Todo: bug with variant number in display (add? or display? )

    // Todo: update incoming stock of variants
  },
  
  [types.EDIT_PURCHASE] (state, {order, items}) {
    let purchaseOrder = setSameAttributeValues(order, s.PURCHASE_ORDER_ATTR);
  },
  
  [types.RECEIVE_PURCHASE] (state, {purchaseOrder, items}) {
    let toReceives = purchaseOrder.toReceives;

    let received = {};
    received.datetime = currentDateTime();

    let variants = [];

    Array.from(items).forEach(item => {
      let variant = {};
      variant.variantId = item.id;
      variant.quantity = parseInt(item.toReceive);

      if (item.value && variant.quantity > 0) {
        variants.push(variant);
        toReceives = toReceives.map(t => {
          if (t.variantId === variant.variantId) {
            t.quantity -= variant.quantity;
            t.receivedQuantity += variant.quantity;
            t.toReceive = t.quantity;
          }
          return t;
        });

        toReceives = toReceives.filter(t => t.quantity > 0);
      }
    });

    received.variants = variants;

    purchaseOrder.receives.push(received);
    purchaseOrder.toReceives = toReceives;
    if (toReceives.length === 0) {
      purchaseOrder.status = s.STATUS_RECEIVED;
      purchaseOrder.received = true;
      purchaseOrder.receivedAt = received.datetime;
    }
    
    // init toChecks
    Array.from(variants).forEach(variant => {
      variant.toCheck = variant.quantity;
      let hasVariant = false;
      for (let i = 0; i < purchaseOrder.toChecks.length; i++) {
        if (purchaseOrder.toChecks[i].variantId === variant.variantId) {
          purchaseOrder.toChecks[i].toCheck += variant.toCheck;
          purchaseOrder.toChecks[i].quantity += variant.toCheck;
          hasVariant = true;
          break;
        }
      }
      if (!hasVariant) {
        purchaseOrder.toChecks.push(Object.assign({}, variant));
      }
    });
    
    // Update received percentage
    purchaseOrder.receivedQuantity = calculateHasDoneQuantity(purchaseOrder.receives);
    purchaseOrder.receivedPercentage = (purchaseOrder.receivedQuantity / purchaseOrder.quantity).toFixed(2) * 100;
  
    updatePurchaseOrder(purchaseOrder);
  },
  
  [types.CHECK_PURCHASE] (state, {purchaseOrder, items}) {
    let toChecks = purchaseOrder.toChecks;
    
    let checked = {};
    checked.datetime = currentDateTime();
    
    let variants = [];
    
    Array.from(items).forEach(item => {
      let variant = {};
      variant.variantId = item.id;
      variant.quantity = parseInt(item.toCheck);
      
      if (item.value && variant.quantity > 0) {
        variants.push(variant);
        toChecks = toChecks.map(t => {
          if (t.variantId === variant.variantId) {
            t.quantity -= variant.quantity;
            t.checkedQuantity += variant.quantity;
            t.toCheck = t.quantity;
          }
          return t;
        });
        
        toChecks = toChecks.filter(t => t.quantity > 0);
      }
    });
    
    checked.variants = variants;
    
    purchaseOrder.checkedItems.push(checked);
    purchaseOrder.toChecks = toChecks;
    if (toChecks.length === 0 && purchaseOrder.toReceives.length === 0) {
      purchaseOrder.status = s.STATUS_CHECKED;
      purchaseOrder.checked = true;
      purchaseOrder.checkedAt = checked.datetime;
    }
  
    purchaseOrder.checkedQuantity = calculateHasDoneQuantity(purchaseOrder.checkedItems);
    purchaseOrder.checkedPercentage = (purchaseOrder.checkedQuantity / purchaseOrder.quantity).toFixed(2) * 100;
  
    // init toStores
    Array.from(variants).forEach(variant => {
      variant.toStore = variant.quantity;
      variant.toAllocate = variant.quantity;
      let hasVariant = false;
      for (let i = 0; i < purchaseOrder.toStores.length; i++) {
        if (purchaseOrder.toStores[i].variantId === variant.variantId) {
          purchaseOrder.toStores[i].toStore += variant.toStore;
          purchaseOrder.toStores[i].quantity += variant.toStore;
          purchaseOrder.toStores[i].toAllocate += variant.toAllocate;
          hasVariant = true;
          break;
        }
      }
      if (!hasVariant) {
        purchaseOrder.toStores.push(Object.assign({}, variant));
      }
    });
    
    updatePurchaseOrder(purchaseOrder);
  },
  
  [types.STORE_PURCHASE] (state, { purchaseOrder, items }) {
    let toStores = purchaseOrder.toStores;
    
    let stored = {};
    stored.datetime = currentDateTime();
    
    let variants = [];
    
    Array.from(items).forEach(item => {
      let variant = {};
      variant.variantId = item.id;
      variant.quantity = parseInt(item.toStore);
      
      if (item.value && variant.quantity > 0) {
        variants.push(variant);
        toStores = toStores.map(t => {
          if (t.variantId === variant.variantId) {
            t.quantity -= variant.quantity;
            t.storedQuantity += variant.quantity;
            t.toStore = t.quantity;
          }
          return t;
        });
        
        toStores = toStores.filter(t => t.quantity > 0);
      }
    });
    
    stored.variants = variants;
    
    purchaseOrder.storedItems.push(stored);
    purchaseOrder.toStores = toStores;
    if (toStores.length === 0
      && purchaseOrder.toReceives.length === 0
      && purchaseOrder.toChecks.length === 0) {
      purchaseOrder.status = s.STATUS_STORED;
      purchaseOrder.stored = true;
      purchaseOrder.storedAt = stored.datetime;
    }
  
    purchaseOrder.storedQuantity = calculateHasDoneQuantity(purchaseOrder.storedItems);
    purchaseOrder.storedPercentage = (purchaseOrder.storedQuantity / purchaseOrder.quantity).toFixed(2) * 100;
  
    updatePurchaseOrder(purchaseOrder);
  },
  
  [types.ALLOCATE_PURCHASE] (state, { purchaseOrder, variant, quantity }) {
    purchaseOrder.toStores = purchaseOrder.toStores.map(t => {
      if (t.variantId === variant.id) {
        t.toAllocate -= quantity;
      }
      return t;
    });
    
    updatePurchaseOrder(purchaseOrder)
  },
  
  [types.ADJUST_PURCHASE] (state, {purchaseOrder, adjustment}) {
    purchaseOrder.adjustments.push(adjustment);
    updatePurchaseOrder(purchaseOrder);
  },

  [types.HANDLE_RECOMMENDATION] (state, recommendation) {
    state.recommendations.map(r => {
      if (r.id === recommendation.id) {
        r = recommendation;
      }
      return r;
    });
    udpateRecommendation(state.recommendations);
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
    commit(types.ADD_PURCHASE, { order, items });
    let attribute = s.INCOMING;
    commit(types.INCREASE_STOCK, { attribute, items });
  },
  
  editPurchase ({commit}, {order, items}) {
    log('edit purchase');
    commit(types.EDIT_PURCHASE, {order, items});
  },
  
  receivePurchaseOrder ({commit, getters}, {order, items}) {
    log('receive purchase', order, items);
    let purchaseOrder = getters.getOrderByNumber(order.orderNumber);
    commit(types.RECEIVE_PURCHASE, {purchaseOrder, items});
    let increaseAttr = s.INBOUNDING;
    let decreaseAttr = s.INCOMING;
    let itemAttr = 'toReceive';
    commit(types.UPDATE_STOCK, { increaseAttr, decreaseAttr, items, itemAttr });
  },

  checkPurchaseOrder ({ dispatch, commit, getters}, {order, items}) {
    log('check purchase');
    let purchaseOrder = getters.getOrderByNumber(order.orderNumber);
    commit(types.CHECK_PURCHASE, {purchaseOrder, items});
    dispatch('smartAllocation', { purchaseOrder });
    // setTimeout(dispatch.bind(null, 'smartAllocation', { purchaseOrder }), 100);
    // setTimeout(dispatch, 100, 'smartAllocation', { purchaseOrder });
  },

  allocatePurchaseOrder ({commit, getters}, {order, variant, quantity}) {
    log('allocate purchase order');
    let purchaseOrder = getters.getOrderByNumber(order.orderNumber);
    commit(types.ALLOCATE_PURCHASE, {purchaseOrder, variant, quantity});
  },
  
  storePurchaseOrder ({commit, getters}, {order, items}) {
    log('store purchase');
    let purchaseOrder = getters.getOrderByNumber(order.orderNumber);
    commit(types.STORE_PURCHASE, {purchaseOrder, items});
    let increaseAttr = s.AVAILABLE;
    let decreaseAttr = s.INBOUNDING;
    let itemAttr = 'toStore';
    commit(types.UPDATE_STOCK, { increaseAttr, decreaseAttr, items, itemAttr });
  },
  
  adjustPurchaseOrder ({commit, getters}, {order, adjustment}) {
    log('adjust purchase');
    let purchaseOrder = getters.getOrderByNumber(order.orderNumber);
    commit(types.ADJUST_PURCHASE, {purchaseOrder, adjustment});
    
    if (adjustment.status === s.PROCESS_CHECKING) {
      let increaseAttr = s.INCOMING;
      let decreaseAttr = s.INBOUNDING;
      let items = adjustment.items;
      let itemAttr = 'quantity';
      commit(types.UPDATE_STOCK, { increaseAttr, decreaseAttr, items, itemAttr });
      // Todo: send message to purchasing crew to create new order
    }
  },

  handleRecommendation ({commit, getters}, number) {
    log('handle recommendation');
    let recommendation = getters.getRecommendationByNumber(number);
    commit(types.HANDLE_RECOMMENDATION, recommendation);
  }

};

export default {
  state,
  getters,
  mutations,
  actions
}
