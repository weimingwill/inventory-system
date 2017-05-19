/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
import * as types from '../mutation-types'
import { log } from '../../utils/utils';

import {
  initNotifications
} from '../../db/init-data'

const state = {
  notifications: [],
};

const getters = {
  notifications: state => state.notifications
};

const mutations = {
  [types.INIT_NOTIFICATIONS] (state) {
    let notificationObj = initNotifications();
    state.notifications = notificationObj.messages;
  
    state.notifications.map(n => {
      n.subtitle = n.subtitle.replace('-', ', ');
      return n;
    });
  
    let divider = { divider: true, inset: true };
    
    for (let i = 0; i < state.notifications.length - 1; i++) {
      if (parseInt(i % 2) === 0) {
        state.notifications.splice(i - 1, 0, divider);
      }
    }
  },
};

const actions = {
  initNotifications ({commit}) {
    log('init notifications');
    commit(types.INIT_NOTIFICATIONS)
  },
  
};

export default {
  state,
  getters,
  mutations,
  actions
}
