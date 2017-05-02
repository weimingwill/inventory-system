/**
 * Created by zhuang_w-pc on 5/2/2017.
 */
import { log, dashToCamelCase } from '../store/utils'
import * as dbKey from './setting'


const initClasses = { initProducts };

function initInventory() {
  let objects = [
    'products',
    'variants',
    'suppliers',
    'supplier-contacts',
    'warehouses'
  ];
  
  let initObject = {};
  
  objects.forEach((object) => {
    let camelCaseStr = dashToCamelCase(object);
    initObject[object] = initObjects(object, camelCaseStr);
  });
  
  return initObject;
}

function initProducts() {
  log('init products');
  let products = localStorage.products;
  if (!products) {
    products = require('../data/products.csv');
    products = products.map(p => {
      p.value = false;
      return p;
    });
    localStorage.products = JSON.stringify(products);
  } else {
    products = JSON.parse(products)
  }
  return products;
}

function initObjects(name, nameCamelCase) {
  let exceptionObjects = ['products'];
  
  if (exceptionObjects.includes(name)) {
  // call function dynamically. e.g initProduct
    let functionName = 'init' + nameCamelCase.charAt(0).toUpperCase() + nameCamelCase.slice(1);
    return initClasses[functionName]();
  }
  
  let objects = localStorage.getItem(nameCamelCase);
  if (!objects) {
    objects = require('../data/' + name + '.csv');
    
    localStorage.setItem(nameCamelCase, JSON.stringify(objects));
  } else {
    objects = JSON.parse(objects);
  }
  return objects;
}

function addProduct(product) {
  let products = JSON.parse(localStorage.getItem(dbKey.PRODUCTS));
  products.push(product);
  localStorage.setItem(dbKey.PRODUCTS, JSON.stringify(products));
}

function addVariants(newVariants) {
  let variants = localStorage.getItem(dbKey.VARIANTS);
  variants.concat(newVariants);
  localStorage.setItem(dbKey.VARIANTS, JSON.stringify(variants));
}

export {
  initInventory,
  
  addProduct,
  addVariants
}