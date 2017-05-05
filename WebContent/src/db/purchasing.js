/**
 * Created by zhuang_w-pc on 5/3/2017.
 */
import {
  log,
} from '../utils/utils'

import { PURCHASE_ORDERS } from './setting'

function addPurchaseOrder(purchaseOrder) {
  let purchaseOrders = JSON.parse(localStorage.getItem(PURCHASE_ORDERS));
  purchaseOrders.push(purchaseOrder);
  localStorage.setItem(PURCHASE_ORDERS, JSON.stringify(purchaseOrders));
}

export {
  addPurchaseOrder
}