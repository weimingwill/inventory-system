/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import {newIdOfArray, currentDateTime, log} from '../utils';

const imagePath = '/inventory-i18n-task3/WebContent/src/assets/logo.png';

const state = {
  products: [],
  variants: [],
  suppliers: [],
  supplierContacts: [],
  warehouses: []
};

const getters = {
  getSupplierById: (state, getters) => (id) => {
    return state.suppliers.filter(s => s.id === id)[0];
  },
  
  getSupplierNameById: (state, getters) => (id) => {
    let supplier = getters.getSupplierById(id);
    return supplier.name;
  },
  
  getBrandById: (state, getters) => (id) => {
    let supplier = getters.getSupplierById(id);
    return supplier.brand;
  },
  
  getSupplierByName: (state, getters) => (name) => {
    return state.suppliers.filter(s => s.name === name)[0]
  },
  
  supplierNames: state => state.suppliers.map(s => s.name),
  supplierBrands: state => state.suppliers.map(s => s.brand),
  productTypes: state => state.products.map(p => p.type),
  warehouseLocations: state => state.warehouses.map(w => w.location)
  
};

const mutations = {
  [types.INIT_INVENTORY] (state) {
    state.products = require('../../data/products.csv');
    state.products = state.products.map(p => {
      p.value = false;
      return p;
    });
    log(state.products)
    state.variants = require('../../data/variants.csv');
    state.suppliers = require('../../data/suppliers.csv');
    state.supplierContacts = require('../../data/supplier-contacts.csv');
    state.warehouses = require('../../data/warehouses.csv');
  },
  
  [types.CREATE_PRODUCT] (state, product) {
    product.id = newIdOfArray(state.products);
    product.supplierId = state.suppliers.filter(s => s.name === product.supplier)[0].name;
    product.available = 0;
    product.committed = 0;
    product.onHand = 0;
    product.sold = 0;
    product.statu = "active";
    product.value = false;
    let datetime = currentDateTime();
    product.created = datetime;
    product.updated = datetime;
    // default image
    product.image = imagePath;
    // Todo change to actual warehouse location
    product.stockLocation = 1;
    state.products.push(product);
    console.log(state.products);
  },
  
  [types.CREATE_VARIANT] (state, product) {
    
  }
};

const actions = {
  createProduct ({commit}, newProduct) {
    commit(types.CREATE_PRODUCT, newProduct);
  },
  
  initInventory ({commit}) {
    log('init inventory');
    commit(types.INIT_INVENTORY)
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
