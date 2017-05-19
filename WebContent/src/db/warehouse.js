/**
 * Created by zhuang_w-pc on 5/16/2017.
 */
import {
  log,
  updateArrayById
} from '../utils/utils'

import { CELL_VARAINT_JOINS, SHELVES, LAYERS, CELLS } from './setting'

function updateCellVariantJoins(newCellVariantJoins) {
  log('update cell variant joins', newCellVariantJoins);
  let cellVariantJoins = JSON.parse(localStorage.getItem(CELL_VARAINT_JOINS));
  Array.from(newCellVariantJoins).forEach(newCellVariantJoin => {
    let isExist = false;
    for (let i = 0; i < cellVariantJoins.length; i++) {
      let cellVariantJoin = cellVariantJoins[i];
      if (cellVariantJoin.cellId === newCellVariantJoin.cellId
        && cellVariantJoin.variantId === newCellVariantJoin.variantId) {
        isExist = true;
        cellVariantJoins[i].quantity = newCellVariantJoin.quantity;
        cellVariantJoins[i].purchases = newCellVariantJoin.purchases;
        break;
      }
    }
    if (!isExist) {
      cellVariantJoins.push(newCellVariantJoin);
    }
  });
  
  localStorage.setItem(CELL_VARAINT_JOINS, JSON.stringify(cellVariantJoins));
}

function updateAllShelves(shelves) {
  localStorage.setItem(SHELVES, JSON.stringify(shelves));
}

function updateAllLayers(layers) {
  localStorage.setItem(LAYERS, JSON.stringify(layers));
}

function updateAllCells(cells) {
  localStorage.setItem(CELLS, JSON.stringify(cells));
}

function updateShelves(updatedShelves) {
  let shelves = JSON.parse(localStorage.getItem(SHELVES));
  shelves = updateArrayById(updatedShelves, shelves);
  localStorage.setItem(SHELVES, JSON.stringify(shelves));
}

function updateLayers(updatedLayers) {
  let layers = JSON.parse(localStorage.getItem(LAYERS));
  layers = updateArrayById(updatedLayers, layers);
  localStorage.setItem(LAYERS, JSON.stringify(layers));
}

function updateCells(updatedCells) {
  let cells = JSON.parse(localStorage.getItem(CELLS));
  cells = updateArrayById(updatedCells, cells);
  localStorage.setItem(CELLS, JSON.stringify(cells));
}

export {
  updateAllCells,
  updateAllLayers,
  updateAllShelves,
  updateCellVariantJoins,
  updateCells,
  updateLayers,
  updateShelves
}