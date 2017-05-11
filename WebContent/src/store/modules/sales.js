/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import {
  newIdOfArray,
  currentDateTime,
  getFormatedDate,
  getFirstCharOfEachWord,
  calculateDistance,
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

  getLabels: (state) => (id) => state.sales.filter(s => s.variantId === id).map(s => s.time),

  getSales: (state) => (id) => state.sales.filter(s => s.variantId === id).map(s => s.sales),

  getPredictions: (state) => (originData, numOfSeasons=1) => {
    let forecast = require('nostradamus')
      , alpha = 0.5  // overall smoothing component
      , beta = 0.5   // trend smoothing component
      , gamma = 0.4  // seasonal smoothing component
      , period = 12   // # of observations per season
      , m = 12        // # of future observations to forecast
      , predictions = []
      , data = originData.slice()
      , dataSize = data.length
      , predictionSize = 0;
  
    // Calculate alpha, beta and gamma that has smallest distance to original data
    let minDiff = 5000;
    for (let a = 0.1; a < 1; a += 0.1) {
      for (let b = 0.1; b < 1; b += 0.1) {
        for (let g = 0.1; g < 1; g += 0.1) {
          predictions = forecast(data, alpha, beta, gamma, period, m);
          let start = predictions.lastIndexOf(0);
          let distance = calculateDistance(data, predictions, start, dataSize);
          if (minDiff > distance) {
            minDiff = distance;
            alpha = a;
            beta = b;
            gamma = g;
          }
        }
      }
    }
    
    let min = Math.min.apply(null, data);
    let max = Math.max.apply(null, data);
    let finalPredictions = [];
    
    // Get prediction for several number of seasons
    for (let n = 0; n < numOfSeasons; n++) {
      predictions = forecast(data, alpha, beta, gamma, period, m);
      dataSize = data.length;
      predictionSize = predictions.length;
      
      for (let i = 0; i < predictionSize; i++) {
        if (i < dataSize) {
          predictions[i] = 0
        } else {
          predictions[i] = Math.round(predictions[i]);
          predictions[i] = predictions[i] < min - 20? min - 20 : predictions[i];
          predictions[i] = predictions[i] > max + 200? max : predictions[i];
          data.push(predictions[i]);
        }
      }
      
      if (n === 0) {
        finalPredictions = predictions.slice();
      } else {
        finalPredictions = finalPredictions.concat(predictions.slice(dataSize))
      }
    }
    return finalPredictions;
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
