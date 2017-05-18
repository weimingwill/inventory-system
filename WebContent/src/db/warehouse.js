/**
 * Created by zhuang_w-pc on 5/16/2017.
 */
import {
  log,
} from '../utils/utils'

import { CELL_VARAINT_JOINS } from './setting'

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

export {
  updateCellVariantJoins
}