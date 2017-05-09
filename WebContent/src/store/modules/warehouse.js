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

import * as s from '../../utils/setting'

const state = {
  warehouses: [],
  shelves: [],
  layers: [],
  cells: [],
  cellVariantJoin: []
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
  
  getCells: (state, getters) => (layerName, layers) => {
    let layer = layers.find(layer => layer.fullname === layerName);
    return getters.getObjectListByAttr(s.MODULE_WAREHOUSE, s.OBJ_CELLS, 'layerId', layer.id)
  },
  
  getCellVariantJoinByCell: (state, getters) => (cellName, cells) => {
    let cell = cells.find(cell => cell.name === cellName);
    console.log(cells);
    return state.cellVariantJoin.filter(cv => cv.cellId === cell.id).map(c => {
      c.cellName = cellName;
      return c;
    });
  },
};

const mutations = {
  [types.INIT_WAREHOUSE] (state) {
    let warehouseObj = initWarehouses();
    state.warehouses = warehouseObj.warehouses;
    state.shelves = warehouseObj.shelves;
    state.layers = warehouseObj.layers;
    state.cells = warehouseObj.cells;
    state.cellVariantJoin = warehouseObj.cellVariantJoin;
  },
};

const actions = {
  initWarehouse ({commit}) {
    log('init warehouse');
    commit(types.INIT_WAREHOUSE)
  },
  
};

export default {
  state,
  getters,
  mutations,
  actions
}
