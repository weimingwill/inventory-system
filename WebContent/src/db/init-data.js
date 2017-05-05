/**
 * Created by zhuang_w-pc on 5/3/2017.
 */
import {
  log,
  dashToCamelCase,
} from '../utils/utils'

const initClasses = {};

function initProducts() {
  let objects = [
    'products',
    'variants',
  ];
  
  return init(objects)
}

function initPurchasing() {
  let objects = [
    'purchase-orders',
  ];
  
  let objectToCombine = 'purchaseOrders';
  
  let attrsToCombine = [
    'variantId',
    'adjustCost',
    'adjustQuantity',
    'adjustReason',
    'adjusted',
    'received',
    'receivedAt',
    'receivedQuantity',
    'quantity'
  ];
  
  let identifier = 'orderNumber';
  let combinedKey = 'variants';
  let initialObjects = init(objects);
  
  initialObjects[objectToCombine] = combineObjects(initialObjects[objectToCombine], identifier, combinedKey, attrsToCombine);
  return initialObjects
}

function initSuppliers() {
  let objects = [
    'suppliers',
    'supplier-contacts'
  ];
  
  return init(objects);
}

function initWarehouses() {
  let objects = [
    'warehouses'
  ];
  
  return init(objects);
}

function init(objects) {
  let initObject = {};
  
  objects.forEach((object) => {
    let camelCaseStr = dashToCamelCase(object);
    initObject[camelCaseStr] = initObjects(object, camelCaseStr);
  });
  
  return initObject;
}

function initObjects(name, nameCamelCase) {
  let exceptionObjects = [];
  
  if (exceptionObjects.includes(name)) {
    // call function dynamically. e.g initProduct
    let functionName = 'init' + nameCamelCase.charAt(0).toUpperCase() + nameCamelCase.slice(1);
    return initClasses[functionName]();
  }
  
  let objects = localStorage.getItem(nameCamelCase);
  if (!objects) {
    objects = require('../data/' + name + '.csv');
    
    objects = objects.map(object => {
      for (let key in object) {
        if (object.hasOwnProperty(key)) {
          let value = object[key];
          if (!isNaN(value) && value.toString().indexOf('.') != -1) {
            value = parseFloat(value).toFixed(2);
          } else if (!isNaN(value) && value) {
            value = parseInt(value);
          }
          object[key] = value
        }
      }
      
      object.value = false;
      return object;
    });
    
    
    localStorage.setItem(nameCamelCase, JSON.stringify(objects));
  } else {
    objects = JSON.parse(objects);
  }
  return objects;
}

function combineObjects(oldObjects, identifier, combinedKey, attrsToCombine) {
  let identifierValues = [];
  let newObjects = [];
  log(oldObjects);
  oldObjects.forEach((object) => {
    let identifierValue = object[identifier];
    if (!identifierValues.includes(identifierValue)) {
      identifierValues.push(identifierValue);
    }
  });
  
  identifierValues.forEach((value) => {
    let newObject = {};
    newObject[combinedKey] = [];
    let filteredObjects = oldObjects.filter((o) => o[identifier] === value);
    filteredObjects.forEach((filteredObject) => {
      let objectToCombine = {};
      for (let key in filteredObject) {
        if (filteredObject.hasOwnProperty(key)) {
          let value = filteredObject[key];
          if (attrsToCombine.includes(key)) {
            objectToCombine[key] = value;
          } else {
            newObject[key] = value
          }
        }
      }
      newObject[combinedKey].push(objectToCombine);
    });
    newObjects.push(newObject);
  });
  
  newObjects = resetIds(newObjects)
  
  log(newObjects);
  
  return newObjects;
}

function resetIds(objects) {
  return objects.map((object, index) => {
    object.id = index + 1;
    return object;
  })
}

export {
  initProducts,
  initPurchasing,
  initSuppliers,
  initWarehouses
}