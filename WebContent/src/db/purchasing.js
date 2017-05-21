/**
 * Created by zhuang_w-pc on 5/3/2017.
 */
import {
  log,
} from '../utils/utils'

import { PURCHASE_ORDERS, RECOMMENDATION } from './setting'

function addPurchaseOrder(purchaseOrder) {
  let purchaseOrders = JSON.parse(localStorage.getItem(PURCHASE_ORDERS));
  purchaseOrders.push(purchaseOrder);
  localStorage.setItem(PURCHASE_ORDERS, JSON.stringify(purchaseOrders));
}

function updatePurchaseOrder(purchaseOrder) {
  let purchaseOrders = JSON.parse(localStorage.getItem(PURCHASE_ORDERS));
  for (let i = 0; i < purchaseOrders.length; i++) {
    if (purchaseOrders[i].id === purchaseOrder.id) {
      purchaseOrders[i] = purchaseOrder;
    }
  }
  localStorage.setItem(PURCHASE_ORDERS, JSON.stringify(purchaseOrders));
}

function udpateRecommendation(recommendations) {
  localStorage.setItem(RECOMMENDATION, recommendations);
}

export {
  addPurchaseOrder,
  updatePurchaseOrder,
  udpateRecommendation
}