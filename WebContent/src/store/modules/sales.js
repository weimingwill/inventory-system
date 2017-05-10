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

  getLabels: (state) => state.sales.map(s => s.time),

  getSales: (state) => state.sales.map(s => s.sales),

  getPredictions: (state) => (data) => {
    let forecast = require('nostradamus')
      , alpha = 0.6  // overall smoothing component
      , beta = 0.4   // trend smoothing component
      , gamma = 0.4  // seasonal smoothing component
      , period = 4   // # of observations per season
      , m = 4        // # of future observations to forecast
      , predictions = [];

    predictions = forecast(data, alpha, beta, gamma, period, m);

    let dataSize = data.length;
    let predictionSize = predictions.length;

    for (let i = 0; i < predictionSize; i++) {
      if (i < dataSize - 1) {
        predictions[i] = 0
      } else {
        predictions[i] = Math.round(predictions[i])
      }
    }

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
