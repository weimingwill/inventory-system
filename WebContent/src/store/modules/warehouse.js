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
  
  getLayers: (state, getters) => (shelfName) => {
    let shelf = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'fullname', shelfName);
    return getters.getObjectListByAttr(s.MODULE_WAREHOUSE, s.OBJ_LAYERS, 'shelfId', shelf.id);
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

  getShelfByCellId: (state, getters) => (cellId) => {
    let cell = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_CELLS, 'id', cellId);
    let layer = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_LAYERS, 'id', cell.layerId);
    let shelf = getters.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'id', layer.shelfId);
    return shelf;
  },
  
  getVariantAllocations: (state, getters) => (variantId) => {
    let allocations = [];
    let cellVariantJoins = state.cellVariantJoins.filter(cv => cv.variantId === variantId);
    Array.from(cellVariantJoins).forEach(cv => {
      let allocation = {
        location: getters.getLocationByCellId(cv.cellId),
        quantity: cv.quantity
      };
      allocations.push(allocation);
    });
    return allocations;
  },

  getVariantAllocationsShelves: (state, getters) => (variantId, purchaseOrderId) => {
    let shelveNames = [];
    let cellVariantJoins = state.cellVariantJoins.filter(cv => cv.variantId === variantId && cv.purchaseOrderId === purchaseOrderId);
    Array.from(cellVariantJoins).forEach(cv => {
      let shelf = getters.getShelfByCellId((cv.cellId));
      if (!shelveNames.includes(shelf.name)) {
        shelveNames.push(shelf.name);
      }
    });
    return shelveNames.join(', ');
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
  },
  
  [types.ALLOCATE_ITEMS] (state, { variant, quantity, orderId, cells, cellVariantJoins }) {
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];
      let cellVariantJoin = cellVariantJoins.find(cv => cv.variantId === variant.id && cv.cellId === cell.id);
      
      if (!cellVariantJoin) {
        cellVariantJoin = {
          cellId: cell.id,
          variantId: variant.id,
          purchaseOrderId: orderId,
          quantity: 0
        };
        cellVariantJoins.push(cellVariantJoin);
      }
      
      let capacity = cell.capacity - cellVariantJoin.quantity;
      if (capacity > 0 && quantity >= capacity) {
        quantity -= capacity;
        cellVariantJoin.quantity += capacity;
      } else if (capacity > 0 && quantity < capacity) {
        quantity = 0;
        cellVariantJoin.quantity += quantity;
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
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
