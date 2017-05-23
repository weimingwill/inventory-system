/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import {
  newIdOfArray,
  currentDateTime,
  formatProductName,
  getFirstCharOfEachWord,
  removeArrayDuplicates,
  log} from '../../utils/utils';

import {
  addProduct,
  addVariants,
  updateVariants
} from '../../db/inventory'

import {
  initProducts
} from '../../db/init-data'

const imagePath = '/inventory-i18n-task3/WebContent/src/assets/product-temp.png';

const state = {
  products: [],
  variants: [],
};

const getters = {
  products: state => state.products,
  variants: state => state.variants,
  
  getProductById: (state, getters) => (id) => {
    return state.products.find(p => p.id === id);
  },
  
  getVariantById: (state, getters) => (id) => {
    return state.variants.find(v => v.id === id);
  },
  
  productTypes: state => state.products.map(p => p.type),
  
  getProductVariants: (state, getters) => (productId) => {
    return state.variants.filter(v => v.productId === productId);
  },
  
  getTypeOfVariant: (state, getters) => (variant) => {
    let product = getters.getProductById(variant.productId);
    return product.type;
  },
  
  variantsOfType: state => (type) => {
    return state.variants.filter(v => {
      let product = state.products.find(p => p.id === v.productId);
      return product.type === type
    });
  },

  getVariantsByTypeColorSize: (state, getters) => (type, color, size) => {
    return state.variants.filter(variant => variant.color === color && variant.size === size && getters.getProductById(variant.productId).type === type)
  },

  sizesOfType: state => (type) => {
    let filteredVariants = state.variants.filter(v => {
      let product = state.products.find(p => p.id === v.productId);
      return product.type === type
    });
    let sizes = filteredVariants.map(v => v.size);
    return removeArrayDuplicates(sizes);
  },
  
  colorsOfType: state => (type) => {
    let filteredVariants = state.variants.filter(v => {
      let product = state.products.find(p => p.id === v.productId);
      return product.type === type
    });
    let colors = filteredVariants.map(v => v.color);
    return removeArrayDuplicates(colors);
  },
  
  getVariantIdsByTypeColorSize: state => (type, size, color) => {
    let filteredVariants = state.variants.filter(v => {
      let product = state.products.find(p => p.id === v.productId);
      return product.type === type
    });
    
    // Todo: find all related instead of one
    return filteredVariants.find(v => v.size === size && v.color === color).id;
    // return filteredVariants.find(v => v.size === size && v.color === color).map(v => v.id);
  },
  
  fulfillVariants: (state, getters) => (items, value=true) => {
    return items.map(item => {
      Object.assign(item, getters.getVariantById(item.variantId));
      item.value = value;
      return item;
    });
  },
  
  fulfillNestedVariants: (state, getters) => (items) => {
    return items.map(item => {
      item.variants = getters.fulfillVariants(item.variants);
      return item;
    });
  },
};

const mutations = {
  [types.INIT_INVENTORY] (state) {
    let inventory = initProducts();
    state.products = inventory.products;
  
    state.variants = inventory.variants.map(variant => {
      let product = state.products.find(p => p.id === variant.productId);
      variant.fullname = [product.sku, product.name, variant.name].join(" ");
      return variant;
    });
    log('variants', state.variants);
  },
  
  [types.CREATE_PRODUCT] (state, product) {
    log('Create Product', state.products);
    // Todo keep data in the same format, String or int
    product.id = newIdOfArray(state.products);
    product.name = formatProductName(product.name);
    product.supplierId = state.suppliers.filter(s => s.name === product.supplier)[0].id;
    product.available = 0;
    product.committed = 0;
    product.onHand = 0;
    product.sold = 0;
    product.status = "active";
    product.value = false;
    let datetime = currentDateTime();
    product.created = datetime;
    product.updated = datetime;
    // default image
    product.image = imagePath;
    // Todo change to actual warehouse location
    product.stockLocation = 1;
    state.products.push(product);
    log(state.products);
    addProduct(product)
  },
  
  [types.CREATE_VARIANT] (state, product) {
    log('Create Variant', state.variants);
    let colors = product.color.split(', ');
    let sizes = product.size.split(', ');
    let id = newIdOfArray(state.variants);
    let variants = [];
    colors.forEach((color) => {
      sizes.forEach((size) => {
        let variant = {};
        variant.id = id;
        variant.name = color + "-" + size
        variant.productId = product.id;
        variant.channelId = 0;
        variant.warehouseId = 1;
        variant.shelveId = 1;
        variant.layerId = 1;
        variant.color = color;
        variant.size = size;
        variant.sku = product.sku + "-"
          + getFirstCharOfEachWord(formatProductName(color)) + "-"
          + getFirstCharOfEachWord(size);
        variant.available = 0;
        variant.committed = 0;
        variant.onHand = 0;
        variant.sold = 0;
        variant.image = imagePath;
        variant.weight = "";
        variant.costPrice = product.costPrice;
        variant.sellPrice = product.sellPrice;
        variant.promotionPrice = product.sellPrice;
        variant.reorderPoint = 0;
        variant.isReleased = false;
        variant.created = product.created;
        variant.updated = product.updated;
        variant.value = false;
        id++;
        variants.push(variant);
      })
    });
    log(variants);
    state.variants.concat(variants);
    addVariants(variants);
  },

  [types.UPDATE_STOCK] (state, { increaseAttr, decreaseAttr, items, itemAttr }) {
    Array.from(items).forEach(item => {
      state.variants.find(variant => variant.id === item.id)[increaseAttr] += parseInt(item[itemAttr]);
      state.variants.find(variant => variant.id === item.id)[decreaseAttr] -= parseInt(item[itemAttr]);
    });
    updateVariants(state.variants);
  },
  
  [types.INCREASE_STOCK] (state, { attribute, items }) {
    Array.from(items).forEach(item => {
      state.variants.find(variant => variant.id === item.id)[attribute] += parseInt(item.quantity);
    });
    updateVariants(state.variants);
  },

  [types.DECREASE_STOCK] (state, { attribute, items }) {
    Array.from(items).forEach(item => {
      state.variants.find(variant => variant.id === item.id)[attribute] -= parseInt(item.quantity);
    });
    updateVariants(state.variants);
  },
  
  
};

const actions = {
  createProduct ({commit}, newProduct) {
    commit(types.CREATE_PRODUCT, newProduct);
    setTimeout(() => commit(types.CREATE_VARIANT, newProduct), 100);
  },
  
  createVariant ({commit}, newProduct) {
    commit(types.CREATE_VARIANT, newProduct);
  },
  
  initInventory ({commit}) {
    log('init inventory');
    commit(types.INIT_INVENTORY)
  },
  
};

export default {
  state,
  getters,
  mutations,
  actions
}
