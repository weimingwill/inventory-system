/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import * as helper from '../../helpers/warehouse-helper'
import * as db from '../../db/warehouse'
import * as s from '../../utils/setting'

import {
  newIdOfArray,
  currentDateTime,
  log} from '../../utils/utils';

import {
  initWarehouses
} from '../../db/init-data'


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
    let layers = getters.getLayersOfShelf(shelfName);
    return layers.map(layer => {
      return layer.fullname;
    });
  },

  getCellNames: (state, getters) => (shelfName, layerName) => {
    let cells = getters.getCellsByShelfLayerName(shelfName, layerName);
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

  // get cell / cells
  getCellById: (state) => (cellId) => {
    return state.cells.find(cell => cell.id == cellId);
  },

  getCellByNames: (state, getters) => (shelfName, layerName, cellName) => {
    let cells = getters.getCellsByShelfLayerName(shelfName, layerName);
    return cells.find(c => c.name === cellName);
  },

  getCellByCellVariantJoins: (state, getters) => (cellVariantJoins) => {
    return cellVariantJoins.map(cv => getters.getCellById(cv.cellId));
  },

  getCellsByLayerId: state => (layerId) => {
    return state.cells.filter(cell => cell.layerId === layerId)
  },

  getCellsOfShelf: (state, getters) => (shelfName) => {
    let layers = getters.getLayersOfShelf(shelfName);
    let cells = [];
    Array.from(layers).forEach(layer => {
      cells = cells.concat(getters.getCellsByLayerId(layer.id));
    });
    return cells;
  },

  getCellsByShelfLayerName: (state, getters) => (shelfName, layerName) => {
    let layers = getters.getLayersOfShelf(shelfName);
    let layer = layers.find(layer => layer.fullname === layerName);
    return getters.getCellsByLayerId(layer.id)
  },

  // get layer / layers
  getLayerById: (state) => (layerId) => {
    return state.layers.find(layer => layer.id === layerId)
  },

  getLayersByShelfId: (state) => (shelfId) => {
    return state.layers.filter(layer => layer.shelfId === shelfId);
  },

  getLayersOfShelf: (state, getters) => (shelfName) => {
    let shelf = getters.getShelfByFullname(shelfName);
    return getters.getLayersByShelfId(shelf.id);
  },

  getLayerByCellId: (state, getters) => (cellId) => {
    let cell = getters.getCellById(cellId);
    return getters.getLayerById(cell.layerId);
  },

  // get shelf / shelves
  getShelfById: (state) => (shelfId) => {
    return state.shelves.find(shelf => shelf.id === shelfId);
  },

  getShelfByFullname: state => (shelfFullname) => {
    return state.shelves.find(shelf => shelf.fullname === shelfFullname);
  },

  getShelfByCellId: (state, getters) => (cellId) => {
    let cell = getters.getCellById(cellId);
    let layer = getters.getLayerById(cell.layerId);
    return getters.getShelfById(layer.shelfId);
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

  getSupplierShelfNames: (state, getters) => (supplierId) => {
    return state.shelves.filter(shelf => shelf.supplierId === supplierId).map(shelf => shelf.name);
  },

  getLocationByCellId: (state, getters) => (cellId) => {
    let cell = getters.getCellById(cellId);
    let layer = getters.getLayerById(cell.layerId);
    let shelf = getters.getShelfById(layer.shelfId);
    return [shelf.fullname, layer.fullname, cell.name].join(' - ');
  },

  // capacity
  getLayerCapacity: (state, getters) => (shelfName, layerName) => {
    let cells = getters.getCellsByShelfLayerName(shelfName, layerName);
    return cells.map(cell => cell.capacity).reduce((sum, capacity) => {
      return sum + capacity;
    });
  },

  getShelfCapacity: (state, getters) => (shelfName) => {
    let layers = getters.getLayersOfShelf(shelfName);
    return layers.map(layer => getters.getLayerCapacity(shelfName, layer.fullname)).reduce((sum, capacity) => {
      return sum + capacity;
    })
  },

  // get cellVariantJoin / cellVariantJoins
  getCellVariantsByCellId: state => (cellId) => {
    return state.cellVariantJoins.filter(cv => cv.cellId === cellId);
  },

  getCellVariantsByCell: (state, getters) => (cell) => {
    let cellVariantJoins = getters.getCellVariantsByCellId(cell.id);
    return getters.fulfillCellVariantJoins(cell, cellVariantJoins);
  },

  getCellVariantsByCells: (state, getters) => (cells) => {
    let cellVariantJoins = []
      , cellVariantJoin;
    Array.from(cells).forEach(cell => {
      cellVariantJoin = getters.getCellVariantsByCell(cell);
      cellVariantJoins = cellVariantJoins.concat(cellVariantJoin);
    });
    return cellVariantJoins;
  },

  getCellVariantsByLayer: (state, getters) => (layer) => {
    let cells = getters.getCellsByLayerId(layer.id);
    return getters.getCellVariantsByCells(cells);
  },

  getCellVariantsByShelfName: (state, getters) => (shelfName) => {
    let cells = getters.getCellsOfShelf(shelfName);
    return getters.getCellVariantsByCells(cells);
  },

  getCellVariantsByShelves: (state, getters) => (shelves) => {
    let cellVariantJoins = [];
    Array.from(shelves).forEach(shelf => {
      cellVariantJoins = cellVariantJoins.concat(getters.getCellVariantsByShelfName(shelf.fullname));
    });
    return cellVariantJoins;
  },

  getCellVariantsByShelfLayerName: (state, getters) => (shelfName, layerName) => {
    let cells = getters.getCellsByShelfLayerName(shelfName, layerName);
    return getters.getCellVariantsByCells(cells);
  },

  getCellVariantsByShelfLayerCellName: (state, getters) => (shelfName, layerName, cellName) => {
    let cell = getters.getCellByNames(shelfName, layerName, cellName);
    return getters.getCellVariantsByCell(cell);
  },

  getCellVariantByVariantIdAndOrderId: (state, getters) => (variantId, purchaseOrderId) => {
    let cellVariants = state.cellVariantJoins.filter(cv => cv.variantId === variantId && Object.keys(cv.purchases).includes(purchaseOrderId.toString()));
    return getters.fulfillCellVariantJoinsWithVariantInfo(cellVariants);
  },

  fulfillCellVariantJoinsWithVariantInfo: (state, getters) => (cellVariantJoins) => {
    return cellVariantJoins.map(cv => {
      let variant = getters.getVariantById(cv.variantId);
      cv.fullname = variant.fullname;
      cv.image = variant.image;
      return cv
    });
  },

  fulfillCellVariantJoins: (state, getters) => (cell, cellVariantJoins) => {
    let layer = getters.getLayerById(cell.layerId);
    let shelf = getters.getShelfById(layer.shelfId);

    return cellVariantJoins.map(cv => {
      let variant = getters.getVariantById(cv.variantId);
      cv.cellName = cell.name;
      cv.layerName = layer.fullname;
      cv.shelfName = shelf.fullname;
      cv.fullname = variant.fullname;
      cv.image = variant.image;
      return cv
    });
  },

  getVariantsOfCellVariants: (state) => (cellVariants) => {
    let variantIds = [];
    Array.from(cellVariants).forEach(cv => {
      if (!variantIds.includes(cv.variantId)) {
        variantIds.push(cv.variantId);
      }
    });
    return variantIds;
  },

  getShelfFilledBackgroundColor: (state, getters) => (baseColor, color, percentage) => {
    return `linear-gradient(to top, ${color} ${percentage}%, ${baseColor} 0%)`
  },

  getOccupiedCapacityOfShelf: (state, getters) => (shelfName) => {
    let cellVariantJoins = getters.getCellVariantsByShelfName(shelfName);
    return helper.getVariantJoinsCapacity(cellVariantJoins)
  },

  getShelfFilledPercentage: (state, getters) => (shelfName) => {
    let shelf = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'name', shelfName);
    shelfName = shelf.fullname;
    let capacity = getters.getShelfCapacity(shelfName);
    let occupiedCapacity = getters.getOccupiedCapacityOfShelf(shelfName);
    return (occupiedCapacity / capacity).toFixed(2) * 100;
  },


  getVariantAllocations: (state, getters) => (cellVariantJoins, purchaseOrderId) => {
    // All these cellVariants should be the same variant
    let allocations = []
      , cellName
      , layerName
      , shelfName
      , nameMap = {}
      , cell
      , layer
      , shelf
      , quantity
      , location
      , allocation
      , allocatedLocations = []
      , i
      , j
      , k
      , shelfKey
      , layerKey
      , cellKey
      , shelfKeys
      , layerKeys
      , cellKeys
      , isCellFull
      , cellStart
      , cellEnd
      , cellCumulatedQuantity
      , fullname = ''
      , image = '';

    Array.from(cellVariantJoins).forEach(cv => {
      fullname = cv.fullname;
      image = cv.image;
      if (purchaseOrderId) {
        quantity = cv.purchases[purchaseOrderId];
      } else {
        quantity = cv.quantity;
      }
      cell = getters.getCellById(cv.cellId);
      layer = getters.getLayerById(cell.layerId);
      shelf = getters.getShelfById(layer.shelfId);
      shelfName = shelf.fullname;
      layerName = layer.fullname;
      cellName = cell.name;
      if (nameMap.hasOwnProperty(shelfName) && nameMap[shelfName].hasOwnProperty(layerName)) {
        nameMap[shelfName].quantity += quantity;
        nameMap[shelfName][layerName].quantity += quantity
      } else {
        if (!nameMap.hasOwnProperty(shelfName)) {
          nameMap[shelfName] = {
            capacity: shelf.capacity,
          };
          nameMap[shelfName].quantity = 0;
        }

        nameMap[shelfName][layerName] = {
          capacity: layer.capacity,
        };
  
        nameMap[shelfName].quantity += quantity;
        nameMap[shelfName][layerName].quantity = quantity;
      }

      nameMap[shelfName][layerName][cellName] = {
        quantity: quantity,
        capacity: cell.capacity
      }
    });

    function setAllocations (allocations, { location, quantity, fullname, image }) {
        let allocation = {
          location: location,
          quantity: quantity,
          fullname: fullname,
          image: image
        };
        allocations.push(allocation);
    }

    // Todo: refactor this function to be more elegant
    shelfKeys = Object.keys(nameMap);
    for (i = 0; i < shelfKeys.length; i++) {
      shelfKey = shelfKeys[i];
      if (shelfKey !== 'capacity' && shelfKey !== 'quantity'
        && nameMap[shelfKey].quantity === nameMap[shelfKey].capacity) {
        location = shelfKey;
        quantity = nameMap[shelfKey].quantity;
        if (!allocatedLocations.includes(location)) {
          setAllocations(allocations, { location, quantity, fullname, image });
          allocatedLocations.push(location);
          continue;
        }
      }

      layerKeys = Object.keys(nameMap[shelfKey]);
      for (j = 0; j < layerKeys.length; j++) {
        layerKey = layerKeys[j];
        if (layerKey !== 'capacity' && layerKey !== 'quantity'
          && nameMap[shelfKey][layerKey].quantity === nameMap[shelfKey][layerKey].capacity) {
          location = [shelfKey, layerKey].join(', ');
          quantity = nameMap[shelfKey][layerKey].quantity;
          if (!allocatedLocations.includes(location)) {
            setAllocations(allocations, { location, quantity, fullname, image });
            allocatedLocations.push(location);
            continue;
          }
        }

        cellKeys = Object.keys(nameMap[shelfKey][layerKey]);
        isCellFull = false;
        cellCumulatedQuantity = [];
        cellStart = '';
        cellEnd = '';
        for (k = 0; k < cellKeys.length; k++) {
          cellKey = cellKeys[k];
          if (cellKey !== 'capacity' && cellKey !== 'quantity') {
            quantity = nameMap[shelfKey][layerKey][cellKey].quantity;
            if (quantity === nameMap[shelfKey][layerKey][cellKey].capacity) {
              isCellFull = true;
              if (cellStart === '') {
                cellStart = cellKey;
              }
              cellEnd = cellKey;
              cellCumulatedQuantity.push(quantity);
              if (k !== cellKeys.length - 1) {
                continue;
              }
            } else if (!isCellFull){
              location = [shelfKey, layerKey, cellKey].join(', ');
              if (!allocatedLocations.includes(location)) {
                setAllocations(allocations, { location, quantity, fullname, image });
                allocatedLocations.push(location);
              }
            }

            if (isCellFull) {
              if (cellStart === cellEnd) {
                location = [shelfKey, layerKey, cellStart].join(', ');
              } else {
                location = [shelfKey, layerKey, cellStart + " - " + cellEnd].join(', ');
              }
              quantity = cellCumulatedQuantity.reduce((sum, quantity) => { return sum + quantity });

              if (!allocatedLocations.includes(location)) {
                setAllocations(allocations, { location, quantity, fullname, image });
                allocatedLocations.push(location);
              }

              isCellFull = false;
              cellCumulatedQuantity = [];
              cellStart = '';
              cellEnd = ''
            }
          }
        }
      }
    }

    allocations.sort((a, b) => a.location - b.location);
    log('allocation', allocations);
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

};

const mutations = {
  [types.INIT_WAREHOUSE] (state, warehouseObj) {
    state.warehouses = warehouseObj.warehouses;
    state.shelves = warehouseObj.shelves;
    state.layers = warehouseObj.layers;
    state.cells = warehouseObj.cells;
    state.cellVariantJoins = warehouseObj.cellVariantJoins;
    // log('cellVariantJoins', state.cellVariantJoins);
  },

  [types.ALLOCATE_ITEMS] (state, { variant, quantity, orderId, cells, cellVariantJoins, updatedCellVariantJoins }) {
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
      let updatedCellVariant = {};

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

          updatedCellVariant = Object.assign({}, cellVariantJoin);

          quantity -= allocatedQuantity;
          cellVariantJoin.quantity += allocatedQuantity;

          if (cellVariantJoin.purchases.hasOwnProperty(orderId)) {
            cellVariantJoin.purchases[orderId] += allocatedQuantity;
          } else {
            cellVariantJoin.purchases[orderId] = allocatedQuantity;
          }

          updatedCellVariant.quantity = allocatedQuantity;
          updatedCellVariantJoins.push(updatedCellVariant);
        }
      }

      if (quantity === 0) {
        break;
      }
    }
    db.updateCellVariantJoins(cellVariantJoins);
  }
};

const actions = {
  initWarehouse ({commit, getters}) {
    log('init warehouse');
    let warehouseObj = initWarehouses();

    // init capacity and occupiedCapacity of shelves, layers, cells if first load from csv file
    if (warehouseObj.shelves[0].capacity === 0) {
      let layers
        , cells
        , cellVariantJoins;

      warehouseObj.shelves = warehouseObj.shelves.map(shelf => {
        layers = warehouseObj.layers.filter(layer => layer.shelfId === shelf.id);

        layers = layers.map(layer => {
          cells = warehouseObj.cells.filter(cell => cell.layerId === layer.id);
          cells = cells.map(cell => {
            cellVariantJoins = warehouseObj.cellVariantJoins.filter(cv => cv.cellId === cell.id);
            if (cellVariantJoins.length > 0) {
              cell.occupiedCapacity = helper.getVariantJoinsCapacity(cellVariantJoins);
            } else {
              cell.occupiedCapacity = 0;
            }
            return cell;
          });

          layer.capacity = 0;
          layer.occupiedCapacity = 0;
          Array.from(cells).forEach(cell => {
            layer.capacity += cell.capacity;
            layer.occupiedCapacity += cell.occupiedCapacity;
          });
          return layer;
        });

        shelf.capacity = 0;
        shelf.occupiedCapacity = 0;
        Array.from(layers).forEach(layer => {
          shelf.capacity += layer.capacity;
          shelf.occupiedCapacity += layer.occupiedCapacity;
        });

        return shelf;
      })
    }

    warehouseObj.cellVariantJoins = warehouseObj.cellVariantJoins.map(cv => {
      // cv.purchases, key: purchaseOrderId, value: purchasedQuantity
      if (!cv.purchases) {
        cv.purchases = {}
      }
      return cv;
    });

    commit(types.INIT_WAREHOUSE, warehouseObj);
    setTimeout(() => {
      db.updateAllShelves(warehouseObj.shelves);
      db.updateAllLayers(warehouseObj.layers);
      db.updateAllCells(warehouseObj.cells);
    }, 100)
  },

  allocateItems ({ dispatch, commit, getters }, { variant, quantity, orderId, shelfName, layerName='', cellName=''}) {
    log('allocate items');
    let cells = [];
    let cellVariantJoins = [];
    if (shelfName && layerName && cellName) {
      cells.push(getters.getCellByNames(shelfName, layerName, cellName));
      cellVariantJoins = getters.getCellVariantsByShelfLayerCellName(shelfName, layerName, cellName)
    } else if (shelfName && layerName) {
      cells = getters.getCellsByShelfLayerName(shelfName, layerName);
      cellVariantJoins = getters.getCellVariantsByShelfLayerName(shelfName, layerName);
    } else if (shelfName) {
      let layers = getters.getLayersOfShelf(shelfName);
      Array.from(layers).forEach(layer => {
        cells = cells.concat(getters.getCellsByShelfLayerName(shelfName, layer.fullname))
      });
      cellVariantJoins = getters.getCellVariantsByShelfName(shelfName);
    }
    let updatedCellVariantJoins = [];
    commit(types.ALLOCATE_ITEMS, { variant, quantity, orderId, cells, cellVariantJoins, updatedCellVariantJoins })

    // update shelf, layer, cell occupiedCapacity
    dispatch('updateWarehouse', updatedCellVariantJoins);
  },

  updateWarehouse ({ getters }, updatedCellVariantJoins) {
    log('updateWarehouse', updatedCellVariantJoins);
    let cell
      , layer
      , shelf
      , updatedQuantity
      , cells = []
      , layers = []
      , shelves = [];
    Array.from(updatedCellVariantJoins).forEach(cv => {
      updatedQuantity = cv.quantity;

      cell = getters.getCellById(cv.cellId);
      cell.occupiedCapacity += updatedQuantity;
      cell.isSameVariant = helper.isSameVariant(getters.getCellVariantsByCell(cell));

      layer = getters.getLayerById(cell.layerId);
      layer.occupiedCapacity += updatedQuantity;
      layer.isSameVariant = helper.isSameVariant(getters.getCellVariantsByLayer(layer));

      shelf = getters.getShelfById(layer.shelfId);
      shelf.occupiedCapacity += updatedQuantity;
      shelf.isSameVariant = helper.isSameVariant(getters.getCellVariantsByShelfName(shelf.fullname));

      cells.push(cell);
      layers.push(layer);
      shelves.push(shelf);
    });

    db.updateShelves(shelves);
    db.updateLayers(layers);
    db.updateCells(cells);
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
      cellVariantJoins = getters.getCellVariantsByShelfName(shelfName);
      capacity = getters.getShelfCapacity(shelfName) - helper.getVariantJoinsCapacity(cellVariantJoins);
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
      , shelvesWithDistances = helper.getShelvesWithDistances(shelves, supplierShelves);
    for (i = 0; i < Object.keys(shelvesWithDistances).length && variant.toAllocate > 0; i++) {
      let newShelves = shelvesWithDistances[i];
      newShelves.sort((a, b) => a.name - b.name);
      for (j = 0; j < newShelves.length && variant.toAllocate > 0; j++) {
        let shelfName = newShelves[j].fullname;
        cellVariantJoins = getters.getCellVariantsByShelfName(shelfName);
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
    cellVariantJoins = getters.getCellVariantsByCells(cells);
    capacity = helper.getCellsCapactiy(cells) - helper.getVariantJoinsCapacity(cellVariantJoins);
    if (variant.toAllocate >= capacity) {
      quantity = capacity;
      variant.toAllocate -= quantity;
    } else {
      quantity = variant.toAllocate;
      variant.toAllocate = 0;
    }

    if (quantity > 0) {
      let updatedCellVariantJoins = [];
      commit(types.ALLOCATE_ITEMS, { variant, quantity, orderId, cells, cellVariantJoins, updatedCellVariantJoins });
      dispatch('updateWarehouse', updatedCellVariantJoins)
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
        cellVariantJoins = getters.getCellVariantsByShelves(shelves);

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
