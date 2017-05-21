/**
 * Created by zhuang_w-pc on 5/3/2017.
 */
import {
  log,
  dashToCamelCase,
} from '../utils/utils'

const initClasses = {};

function initUsers() {
  let objects = [
    'users'
  ];

  return init(objects);
}

function initProducts() {
  let objects = [
    'products',
    'variants',
  ];

  return init(objects)
}

function initRecommendation() {
  let objects = [
    'recommendations'
  ];

  let combinedObjParam = {
    objectsToCombine: 'recommendations',
    attrsToCombine: [
      'variantId',
      'size',
      'color',
      'quantity'
    ],
    identifier: 'id',
    combinedKey: 'variants'
  };

  return init(objects, combinedObjParam);
}

function initPurchasing() {
  let objects = [
    'purchase-orders',
  ];

  let combinedObjParam = {
    objectsToCombine: 'purchase-orders',
    attrsToCombine: [
      'variantId',
      // 'adjustCost',
      // 'adjustQuantity',
      // 'adjustReason',
      // 'adjusted',
      // 'receivedAt',
      // 'receivedQuantity',
      'quantity',
      'costPrice'
    ],
    identifier: 'orderNumber',
    combinedKey: 'variants'
  };

  return init(objects, combinedObjParam);
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
    'warehouses',
    'shelves',
    'layers',
    'cells',
    'cell-variant-joins'
  ];

  return init(objects);
}


function initSales() {
  let objects = [
    'sales'
  ];
  return init(objects);
}

function initNotifications() {
  let objects = [
    'messages'
  ];
  return init(objects);
}

// Helper functions
function init(objects, combinedObjParam) {
  let initObject = {};

  objects.forEach((object) => {
    let camelCaseStr = dashToCamelCase(object);
    initObject[camelCaseStr] = initObjects(object, camelCaseStr, combinedObjParam);
  });

  return initObject;
}

function initObjects(name, nameCamelCase, combinedObjParam) {
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
          } else if (value.toLowerCase() === 'false') {
            value = false;
          } else if (value.toLowerCase() === 'true') {
            value = true;
          }
          object[key] = value
        }
      }

      object.value = false;
      return object;
    });

    if (combinedObjParam !== undefined && combinedObjParam.objectsToCombine.includes(name)) {
        objects = combineObjects(objects, combinedObjParam);
    }

    localStorage.setItem(nameCamelCase, JSON.stringify(objects));
  } else {
    objects = JSON.parse(objects);
  }
  return objects;
}

function combineObjects(oldObjects, combinedObjParam) {
  let identifier = combinedObjParam.identifier;
  let attrsToCombine = combinedObjParam.attrsToCombine;
  let combinedKey = combinedObjParam.combinedKey;

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

  newObjects = resetIds(newObjects);

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
  initUsers,
  initProducts,
  initRecommendation,
  initPurchasing,
  initSuppliers,
  initWarehouses,
  initSales,
  initNotifications
}