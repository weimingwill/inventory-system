/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import {
  newIdOfArray,
  currentDateTime,
  getFormatedDate,
  getFirstCharOfEachWord,
  log} from '../../utils/utils';

import {
  initSales
} from '../../db/init-data'

import {
} from '../../db/purchasing'

import * as s from '../../utils/setting'

const state = {
  sales: [],
};

const getters = {
  sales: state => state.sales,

  getNewOrderNumber: (state) => {
    let orderNumberDigits = state.purchaseOrders.map(p => parseInt(p.orderNumber.charAt(p.orderNumber.length - 1)));
    let newOrderNumberDigit = Math.max.apply(Math, orderNumberDigits) + 1;
    return `P0000${newOrderNumberDigit}`;
  },

  getPredictions: (state) => {
    let forecast = require('nostradamus')
      , data = [
      362, 385, 432, 341, 382, 409,
      498, 387, 473, 513, 582, 474,
      544, 582, 681, 557, 628, 707,
      773, 592, 627, 725, 854, 661
    ]
      , alpha = 0.5  // overall smoothing component
      , beta = 0.4   // trend smoothing component
      , gamma = 0.6  // seasonal smoothing component
      , period = 4   // # of observations per season
      , m = 4        // # of future observations to forecast
      , predictions = [];

    predictions = forecast(data, alpha, beta, gamma, period, m);
    console.log(predictions)
    return predictions;
  }
};

const mutations = {
  [types.INIT_SALES] (state) {
    let sales = initSales();
    log(sales)
    state.sales = sales.sales;
  }
};

const actions = {
  initSales ({commit}) {
    log('init sales');
    commit(types.INIT_SALES)
  },

};

export default {
  state,
  getters,
  mutations,
  actions
}
