/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import newIdOfArray from '../utils';

let products = require('../../data/products.csv');
let variants = require('../../data/variants.csv');
let suppliers = require('../../data/suppliers.csv');
let supplierContacts = require('../../data/supplier-contacts.csv');
let warehouses = require('../../data/warehouses.csv');

const state = {
  products: products,
  variants: variants,
  suppliers: suppliers,
  supplierContacts: supplierContacts,
  warehouses: warehouses
};

const mutations = {
  [types.CREATE_PRODUCT] (state, product) {
    // Todo: error in create function
    console.log(product);
    let id = Math.max.apply(Math, state.products.map(a => a.id)) + 1
    console.log(id);
    product.id = id;
    state.products.push(product);
  }
};

const actions = {
  createProduct ({commit}, newProduct) {
    commit(types.CREATE_PRODUCT, newProduct)
  }
};

export default {
  state,
  mutations,
  actions
}
