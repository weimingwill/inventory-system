import * as types from '../mutation-types'

let products = require('../../data/products.csv');
let variants = require('../../data/variants.csv');
let suppliers = require('../../data/suppliers.csv');
let supplierContacts = require('../../data/supplier-contacts.csv');

const state = {
  products: products,
  variants: variants,
  suppliers: suppliers,
  supplierContacts: supplierContacts,
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: false,
    hidden: false
  },
  effect: {
    translate3d: true
  }
};

const mutations = {
  
  
  [types.TOGGLE_DEVICE] (state, device) {
    state.device.isMobile = device === 'mobile';
    state.device.isTablet = device === 'tablet'
  },

  [types.TOGGLE_SIDEBAR] (state, opened) {
    if (state.device.isMobile) {
      state.sidebar.opened = opened
    } else {
      state.sidebar.opened = true
    }
  },

  [types.SWITCH_EFFECT] (state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  }
};

export default {
  state,
  mutations
}
