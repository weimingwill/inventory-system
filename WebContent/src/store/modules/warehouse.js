/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import {
  newIdOfArray,
  currentDateTime,
  log} from '../../utils/utils';

import {
  initWarehouses
} from '../../db/init-data'

import { updateCellVariantJoins } from '../../db/warehouse'

import * as s from '../../utils/setting'

const state = {
  warehouses: [],
  shelves: [],
  layers: [],
  cells: [],
  cellVariantJoins: []
};

const getters = {
  warehouses: state => state.warehouses,
  shelves: state => state.shelves,
  
  warehouseLocations: state => state.warehouses.map(w => w.location),
  
  shelveNames: (state, getters) => {
    return getters.getObjectList(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'fullname');
  },
  
  getLayerNames: (state, getters) => (shelfName) => {
    let layers = getters.getLayers(shelfName);
    return layers.map(layer => {
      return layer.fullname;
    });
  },
  
  getCellNames: (state, getters) => (shelfName, layerName) => {
    let cells = getters.getCells(shelfName, layerName);
    return cells.map(cell => {
      return cell.name
    });
  },
  
  commonShelvesInRows: state => {
    let rows = [];
    let shelves = state.shelves.filter(shelf => shelf.name.charAt(0) === 'C');
    let numOfRow = shelves.length / 10;
    for (let i = 0; i < numOfRow; i++) {
      let row = [];
      for (let j = 0; j < 10; j++) {
        row.push(shelves[i * 10 + j]);
      }
      rows.push(row);
    }
    return rows;
  },
  
  commonShelves: state => {
    return state.shelves.filter(shelf => shelf.name.charAt(0) === 'C');
  },
  
  popularShelves: state => {
    return state.shelves.filter(shelve => shelve.name.charAt(0) === 'P');
  },
  
  crossDockingShelves: state => {
    return state.shelves.filter(shelve => shelve.name.charAt(0) === 'T');
  },
  
  getShelvesOfCells: (state, getters) => (cells) => {
    let shelves = []
      , shelveIds = [];
    
    Array.from(cells).forEach(cell => {
      let shelf = getters.getShelfByCellId(cell.id);
      if (!shelveIds.includes(shelf.id)) {
        shelves.push(shelf);
        shelveIds.push(shelf.id);
      }
    });
    return shelves;
  },
  
  getLayers: (state, getters) => (shelfName) => {
    let shelf = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'fullname', shelfName);
    return getters.getObjectListByAttr(s.MODULE_WAREHOUSE, s.OBJ_LAYERS, 'shelfId', shelf.id);
  },
  
  getSupplierShelfNames: (state, getters) => (supplierId) => {
    return state.shelves.filter(shelf => shelf.supplierId === supplierId).map(shelf => shelf.name);
  },
  
  getCells: (state, getters) => (shelfName, layerName) => {
    let layers = getters.getLayers(shelfName);
    let layer = layers.find(layer => layer.fullname === layerName);
    return getters.getObjectListByAttr(s.MODULE_WAREHOUSE, s.OBJ_CELLS, 'layerId', layer.id)
  },
  
  getCell: (state, getters) => (shelfName, layerName, cellName) => {
    let cells = getters.getCells(shelfName, layerName);
    return cells.find(c => c.name === cellName);
  },
  
  getLayerCapacity: (state, getters) => (shelfName, layerName) => {
    let cells = getters.getCells(shelfName, layerName);
    return cells.map(cell => cell.capacity).reduce((sum, capacity) => {
      return sum + capacity;
    });
  },
  
  getShelfCapacity: (state, getters) => (shelfName) => {
    let layers = getters.getLayers(shelfName);
    return layers.map(layer => getters.getLayerCapacity(shelfName, layer.fullname)).reduce((sum, capacity) => {
      return sum + capacity;
    })
  },
  
  getCellsCapactiy: (state, getters) => (cells) => {
    return cells.map(cell => cell.capacity).reduce((sum, quantity) => {
      return sum + quantity;
    });
  },
  
  getVariantJoinsCapacity: (state, getters) => (cellVariantJoins) => {
    if (cellVariantJoins.length === 0) {
      return 0
    } else {
      return cellVariantJoins.map(cv => cv.quantity).reduce((sum, quantity) => {
        return sum + quantity;
      })
    }
  },
  
  getShelfFilledBackgroundColor: (state, getters) => (baseColor, color, percentage) => {
    return `linear-gradient(to top, ${color} ${percentage}%, ${baseColor} 0%)`
  },
  
  getOccupiedCapacityOfShelf: (state, getters) => (shelfName) => {
    let cellVariantJoins = getters.getCellVariantByShelf(shelfName);
    return getters.getVariantJoinsCapacity(cellVariantJoins)
  },
  
  getShelfFilledPercentage: (state, getters) => (shelfName) => {
    let shelf = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'name', shelfName);
    shelfName = shelf.fullname;
    let capacity = getters.getShelfCapacity(shelfName);
    let occupiedCapacity = getters.getOccupiedCapacityOfShelf(shelfName);
    return (occupiedCapacity / capacity).toFixed(2) * 100;
  },
  
  getCellVariantByShelves: (state, getters) => (shelves) => {
    let cellVariantJoins = [];
    Array.from(shelves).forEach(shelf => {
      cellVariantJoins = cellVariantJoins.concat(getters.getCellVariantByShelf(shelf.fullname));
    });
    return cellVariantJoins;
  },
  
  getCellVariantByShelf: (state, getters) => (shelfName) => {
    let layers = getters.getLayers(shelfName);
    let cellVariantJoins = [];
    for (let i = 0; i < layers.length; i++) {
      let cellVariantJoin = getters.getCellVariantJoinByLayer(shelfName, layers[i].fullname);
      cellVariantJoins = cellVariantJoins.concat(cellVariantJoin);
    }
    return cellVariantJoins;
  },
  
  getCellVariantJoinByLayer: (state, getters) => (shelfName, layerName) => {
    let cells = getters.getCells(shelfName, layerName);
    let cellVariantJoins = [];
    for (let i = 0; i < cells.length; i++) {
      let cellVariantJoin = getters.getCellVariantJoinByCell(shelfName, layerName, cells[i].name);
      cellVariantJoins = cellVariantJoins.concat(cellVariantJoin);
    }
    return cellVariantJoins;
  },
  
  getCellVariantJoinByCell: (state, getters) => (shelfName, layerName, cellName) => {
    let cell = getters.getCell(shelfName, layerName, cellName);
    let cellVariantJoins = getters.getObjectListByAttr(s.MODULE_WAREHOUSE, s.OBJ_CELL_VARIANT, 'cellId', cell.id);
    cellVariantJoins = cellVariantJoins.map(cv => {
      cv.cellName = cell.name;
      cv.layerName = layerName;
      cv.shelfName = shelfName;
      return cv;
    });
    return getters.fulfillCellVariantJoins(cellVariantJoins);
  },
  
  getCellVariantJoinByCells: (state, getters) => (cells) => {
    let cellVariantJoins = [];
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];
      let layer = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_LAYERS, 'id', cell.layerId);
      let shelf = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'id', layer.shelfId);
      let cellVariantJoin = getters.getCellVariantJoinByCell(shelf.fullname, layer.fullname, cell.name);
      cellVariantJoins = cellVariantJoins.concat(cellVariantJoin);
    }
    return cellVariantJoins;
  },
  
  fulfillCellVariantJoins: (state, getters) => (cellVariantJoins) => {
    return cellVariantJoins.map(cv => {
      let variant = getters.getVariantById(cv.variantId);
      cv.fullname = variant.fullname;
      cv.image = variant.image;
      return cv
    });
  },
  
  getLocationByCellId: (state, getters) => (cellId) => {
    let cell = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_CELLS, 'id', cellId);
    let layer = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_LAYERS, 'id', cell.layerId);
    let shelf = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'id', layer.shelfId);
    return [shelf.fullname, layer.fullname, cell.name].join(' - ');
  },

  getLayerByCellId: (state, getters) => (cellId) => {
    let cell = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_CELLS, 'id', cellId);
    let layer = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_LAYERS, 'id', cell.layerId);
    return layer;
  },
  
  getShelfByCellId: (state, getters) => (cellId) => {
    let cell = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_CELLS, 'id', cellId);
    let layer = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_LAYERS, 'id', cell.layerId);
    let shelf = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'id', layer.shelfId);
    return shelf;
  },
  
  getVariantAllocations: (state, getters) => (variantId, purchaseOrderId) => {
    let allocations = [];
    let cellVariantJoins = state.cellVariantJoins.filter(cv => cv.variantId === variantId && Object.keys(cv.purchases).includes(purchaseOrderId.toString()));
    Array.from(cellVariantJoins).forEach(cv => {
      let allocation = {
        location: getters.getLocationByCellId(cv.cellId),
        quantity: cv.purchases[purchaseOrderId]
      };
      allocations.push(allocation);
    });
    return allocations;
  },

  getVariantAllocationsShelves: (state, getters) => (variantId, purchaseOrderId) => {
    let shelveNames = [];
    let cellVariantJoins = state.cellVariantJoins.filter(cv => cv.variantId === variantId && Object.keys(cv.purchases).includes(purchaseOrderId.toString()));
    Array.from(cellVariantJoins).forEach(cv => {
      let shelf = getters.getShelfByCellId((cv.cellId));
      if (!shelveNames.includes(shelf.name)) {
        shelveNames.push(shelf.name);
      }
    });
    shelveNames = shelveNames.sort();
    return shelveNames.join(', ');
  },
  
  getCellByCellVariantJoins: (state, getters) => (cellVariantJoins) => {
    return cellVariantJoins.map(cv => getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_CELLS, 'id', cv.cellId));
  },
  
  calculateShelvesDistance: (state, getters) => (shelfA, shelfB) => {
    shelfA = shelfA.name;
    shelfB = shelfB.name;
    
    let char = shelfA.charAt(0);
    shelfA = parseInt(shelfA.split(char)[1]);
    shelfB = parseInt(shelfB.split(char)[1]);
    
    let a = parseInt(shelfA / 10);
    let b = parseInt(shelfB / 10);
    
    let distance = Math.abs(a - b);
    distance += distance * 10 + Math.min(a, b) - Math.max(a, b);
    distance /= 10
    return distance;
  },
  
  getShelvesWithDistances: (state, getters) => (comparedShelves, allShelves) => {
    let addedShelveIds = []
      , shelvesByDistance = {}
      , distance = 0
      , i;
    while (allShelves.length > 0) {
      allShelves = allShelves.filter(shelf => !addedShelveIds.includes(shelf.id));
      shelvesByDistance[distance] = [];
      Array.from(comparedShelves).forEach(shelf => {
        for (i = 0; i < allShelves.length; i++) {
          let thisShelf = allShelves[i];
          if (distance === getters.calculateShelvesDistance(thisShelf, shelf)) {
            if (!addedShelveIds.includes(thisShelf.id)) {
              shelvesByDistance[distance].push(thisShelf);
              addedShelveIds.push(thisShelf.id);
            }
          }
        }
      });
      distance++;
    }
    log(shelvesByDistance);
    return shelvesByDistance;
  }
  
};

const mutations = {
  [types.INIT_WAREHOUSE] (state) {
    let warehouseObj = initWarehouses();
    state.warehouses = warehouseObj.warehouses;
    state.shelves = warehouseObj.shelves;
    state.layers = warehouseObj.layers;
    state.cells = warehouseObj.cells;
    state.cellVariantJoins = warehouseObj.cellVariantJoins;
  
    state.cellVariantJoins = state.cellVariantJoins.map(cv => {
      // cv.purchases, key: purchaseOrderId, value: purchasedQuantity
      if (!cv.purchases) {
        cv.purchases = {}
      }
      return cv;
    });
    
    // log('cellVariantJoins', state.cellVariantJoins);
  },
  
  [types.ALLOCATE_ITEMS] (state, { variant, quantity, orderId, cells, cellVariantJoins }) {
    
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];
      let cellVariantJoin = {
        cellId: cell.id,
        variantId: variant.id? variant.id : variant.variantId,
        quantity: 0,
        purchases: {}
      };
      
      let filteredCellVariantJoins = cellVariantJoins.filter(cv => cv.cellId === cell.id);
      let occupiedCapacity = 0;
      
      if (filteredCellVariantJoins.length === 0) {
        cellVariantJoins.push(cellVariantJoin);
      } else {
        occupiedCapacity = filteredCellVariantJoins.map(cv => cv.quantity).reduce((sum, quantity) => {
          return sum + quantity
        });
      }
      
      let capacity = cell.capacity - occupiedCapacity;
      if (capacity > 0) {
        let allocatedQuantity = 0;
        if (quantity >= capacity) {
          allocatedQuantity = capacity;
        } else if (quantity < capacity) {
          allocatedQuantity = quantity;
        }
  
        if (allocatedQuantity > 0) {
          let filteredCellVariantJoin = cellVariantJoins.find(cv => cv.cellId === cell.id && variant.variantId === cv.variantId);
          if (!filteredCellVariantJoin) {
            cellVariantJoins.push(cellVariantJoin);
          } else {
            cellVariantJoin = filteredCellVariantJoin;
          }
  
          quantity -= allocatedQuantity;
          cellVariantJoin.quantity += allocatedQuantity;
  
          if (cellVariantJoin.purchases.hasOwnProperty(orderId)) {
            cellVariantJoin.purchases[orderId] += allocatedQuantity;
          } else {
            cellVariantJoin.purchases[orderId] = allocatedQuantity;
          }
        }
      }
      
      if (quantity === 0) {
        break;
      }
    }
    
    updateCellVariantJoins(cellVariantJoins);
  }
};

const actions = {
  initWarehouse ({commit}) {
    log('init warehouse');
    commit(types.INIT_WAREHOUSE)
  },
  
  allocateItems ({ commit, getters }, { variant, quantity, orderId, shelfName, layerName='', cellName=''}) {
    log('allocate items');
    let cells = [];
    let cellVariantJoins = [];
    if (shelfName && layerName && cellName) {
      cells.push(getters.getCell(shelfName, layerName, cellName));
      cellVariantJoins = getters.getCellVariantJoinByCell(shelfName, layerName, cellName)
    } else if (shelfName && layerName) {
      cells = getters.getCells(shelfName, layerName);
      cellVariantJoins = getters.getCellVariantJoinByLayer(shelfName, layerName);
    } else if (shelfName) {
      let layers = getters.getLayers(shelfName);
      Array.from(layers).forEach(layer => {
        cells = cells.concat(getters.getCells(shelfName, layer.fullname))
      });
      cellVariantJoins = getters.getCellVariantByShelf(shelfName);
    }
    commit(types.ALLOCATE_ITEMS, { variant, quantity, orderId, cells, cellVariantJoins })
  },
  
  autoAllocateToShelves ({ dispatch, commit, getters }, { variant, shelves, orderId }) {
    log('auto allocate to shelves');
    let i
      , numOfShelves
      , cellVariantJoins = []
      , capacity
      , quantity;
    
    numOfShelves = shelves.length;
    for (i = 0; i < numOfShelves && variant.toAllocate > 0; i++) {
      let shelfName = shelves[i].fullname;
      cellVariantJoins = getters.getCellVariantByShelf(shelfName);
      capacity = getters.getShelfCapacity(shelfName) - getters.getVariantJoinsCapacity(cellVariantJoins);
      if (variant.toAllocate >= capacity) {
        quantity = capacity;
        variant.toAllocate -= quantity;
      } else {
        quantity = variant.toAllocate;
        variant.toAllocate = 0;
      }
      if (quantity > 0) {
        dispatch('allocateItems', {variant, quantity, orderId, shelfName});
      }
    }
    return variant;
  },
  
  autoAllocateToNearestNewShelf ({ dispatch, commit, getters }, { variant, purchaseOrder, shelves }) {
    log('auto allocate to nearest new shelf');
    let i
      , j
      , capacity
      , quantity
      , cellVariantJoins
      , promise
      , orderId = purchaseOrder.id
      , supplierShelves = getters.commonShelves.filter(shelf => shelf.supplierId === purchaseOrder.supplierId)
      , shelvesWithDistances = getters.getShelvesWithDistances(shelves, supplierShelves);
    for (i = 0; i < Object.keys(shelvesWithDistances).length && variant.toAllocate > 0; i++) {
      let newShelves = shelvesWithDistances[i];
      for (j = 0; j < newShelves.length && variant.toAllocate > 0; j++) {
        let shelfName = newShelves[i].fullname;
        cellVariantJoins = getters.getCellVariantByShelf(shelfName);
        if (cellVariantJoins.length === 0) {
          capacity = getters.getShelfCapacity(shelfName);
          
          if (variant.toAllocate >= capacity) {
            quantity = capacity;
            variant.toAllocate -= quantity;
          } else {
            quantity = variant.toAllocate;
            variant.toAllocate = 0;
          }
  
          if (quantity > 0) {
            promise = dispatch('allocateItems', {variant, quantity, orderId, shelfName});
            promise.then(result => variant = result)
          }
        }
      }
    }
    return variant;
  },
  
  autoAllocateToCells ({ dispatch, commit, getters }, { variant, purchaseOrder, cellVariantJoins, joinType }) {
    log('auto allocate to cells', variant, purchaseOrder, cellVariantJoins, joinType);
    let capacity
      , quantity
      , promise
      , orderId = purchaseOrder.id
      , shelves = [];

    let cells = getters.getCellByCellVariantJoins(cellVariantJoins);
    cellVariantJoins = getters.getCellVariantJoinByCells(cells);
    capacity = getters.getCellsCapactiy(cells) - getters.getVariantJoinsCapacity(cellVariantJoins);
    if (variant.toAllocate >= capacity) {
      quantity = capacity;
      variant.toAllocate -= quantity;
    } else {
      quantity = variant.toAllocate;
      variant.toAllocate = 0;
    }
    
    if (quantity > 0) {
      commit(types.ALLOCATE_ITEMS, { variant, quantity, orderId, cells, cellVariantJoins })
    }
  
    // Allocate to shelves of these cells
    if (variant.toAllocate > 0) {
      shelves = getters.getShelvesOfCells(cells);
      promise = dispatch('autoAllocateToShelves', { variant, shelves, orderId });
      promise.then(result => variant = result)
    }
    
    // Allocate to a nearest new shelf
    if (variant.toAllocate > 0 && (joinType === 'product' || joinType === 'type')) {
      promise = dispatch('autoAllocateToNearestNewShelf', { variant, purchaseOrder, shelves });
      promise.then(result => variant = result)
    }
    
    return variant;
  },
  
  smartAllocation ({ dispatch, commit, getters }, { purchaseOrder }) {
    log('smart allocation', purchaseOrder);
    let variants = purchaseOrder.toStores;
    let i
      , numOfVariants = variants.length
      , shelves
      , orderId = purchaseOrder.id
      , promise
      , product
      , joinType
      , quantity
      , cellVariantJoins
      , sameTypeJoins = []
      , sameProductJoins = []
      , sameVariantJoins = []
      , totalToAllocate;
    
    for (i = 0; i < numOfVariants; i++) {
      let variant = variants[i];
      let completeVariant = getters.getVariantById(variant.variantId);
      variant.productId = completeVariant.productId;
      variant.popularity = completeVariant.popularity;
      totalToAllocate = variant.toAllocate;
      log('totalToAllocate', totalToAllocate);
      log('variant', variant);
      
      if (totalToAllocate <= 0) {
        continue;
      }
      
      // Allocate cross docking items
      if (variant.toAllocate > 0 && variant.isCrossDocking) {
        log('cross docking item');
        shelves = getters.crossDockingShelves;
        promise = dispatch('autoAllocateToShelves', { variant, shelves, orderId });
        promise.then(result => variant = result)
      }
  
      // Allocate popular items
      if (variant.toAllocate > 0 && variant.popularity === 1) {
        log('popular item');
        shelves = getters.popularShelves;
        promise = dispatch('autoAllocateToShelves', { variant, shelves, orderId });
        promise.then(result => variant = result)
      }
      
      // Allocate common items
      // Allocate items under the same supplier
      if (variant.toAllocate > 0) {
        log('common item');
        product = getters.getProductById(variant.productId);
        shelves = getters.commonShelves.filter(shelf => shelf.supplierId === purchaseOrder.supplierId);
        cellVariantJoins = getters.getCellVariantByShelves(shelves);
        
        log('shelves', shelves);
        log('cellVariantJoins', cellVariantJoins);
        
        for (let j = 0; j < cellVariantJoins.length; j++) {
          let cellVariantJoin = cellVariantJoins[j];
          let thisVariant = getters.getVariantById(cellVariantJoin.variantId);
          let thisProduct = getters.getProductById(thisVariant.productId);
  
          if (product.type === thisProduct.type) {
            sameTypeJoins.push(cellVariantJoin);
          }
          
          if (product.name === thisProduct.name) {
            sameProductJoins.push(cellVariantJoin);
          }
          
          if (variant.variantId === thisVariant.id) {
            sameVariantJoins.push(cellVariantJoin);
          }
        }
  
        // log('sameVariantJoins', sameVariantJoins);
        // log('sameProductJoins', sameProductJoins);
        // log('sameTypeJoins', sameTypeJoins);
  
        // Allocate items to locations with same variant, same product, same type
        if (variant.toAllocate > 0 && sameVariantJoins.length > 0) {
          log('sameVariantJoins');
          joinType = 'variant';
          cellVariantJoins = sameVariantJoins;
          promise = dispatch('autoAllocateToCells', { variant, purchaseOrder, cellVariantJoins, joinType });
          promise.then(result => variant = result);
          log('variant', variant)
        }
        
        if (variant.toAllocate > 0 && sameProductJoins.length > 0) {
          log('sameProductJoins');
          joinType = 'product';
          cellVariantJoins = sameProductJoins;
          promise = dispatch('autoAllocateToCells', { variant, purchaseOrder, cellVariantJoins, joinType });
          promise.then(result => variant = result);
          log('variant', variant)
        }
        
        if (variant.toAllocate > 0 && sameTypeJoins.length > 0) {
          log('sameTypeJoins');
          joinType = 'type';
          cellVariantJoins = sameTypeJoins;
          promise = dispatch('autoAllocateToCells', { variant, purchaseOrder, cellVariantJoins, joinType });
          promise.then(result => variant = result);
          log('variant', variant)
        }
  
        // Allocate to a new shelf outside the supplier shelves
        if (variant.toAllocate > 0 && sameTypeJoins.length <= 0) {
          log('allocate to new shelf under supplier shelves');
          promise = dispatch('autoAllocateToNearestNewShelf', { variant, purchaseOrder, shelves });
          promise.then(result => variant = result)
          log('variant', variant)
        }
  
        // Allocate to a new shelf outside the supplier shelves
        if (variant.toAllocate > 0 && sameTypeJoins.length <= 0) {
          log('allocate to new shelf outside supplier shelves');
          shelves = getters.commonShelves.filter(shelf => shelf.supplierId && shelf.supplierId != purchaseOrder.supplierId);
          promise = dispatch('autoAllocateToNearestNewShelf', { variant, purchaseOrder, shelves });
          promise.then(result => variant = result)
          log('variant', variant)
        }
      }
      
      quantity = 0;
      commit(types.ALLOCATE_PURCHASE, {purchaseOrder, variant, quantity});
      dispatch('initWarehouse');
    }
    
    // If it is full under the same supplier, allocate it the nearest empty location
  
  },
};

export default {
  state,
  getters,
  mutations,
  actions
}
