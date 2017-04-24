/**
 * Created by zhuang_w-pc on 4/24/2017.
 */
import * as types from '../../mutation-types'
import lazyLoading from './lazyLoading'
import inventoryControl from './inventory-control'

// show: meta.label -> name
// name: component name
// meta.label: display label

const state = {
  items: [
    // {
    //   name: 'Dashboard',
    //   path: '/dashboard',
    //   meta: {
    //     icon: 'fa-tachometer',
    //     link: 'dashboard/index.vue'
    //   },
    //   component: lazyLoading('dashboard', true)
    // },
    // {
    //   name: 'Axios',
    //   path: '/axiosDemo',
    //   meta: {
    //     auth: true,
    //     icon: 'fa-rocket',
    //     link: 'axios/index.vue'
    //   },
    //   component: lazyLoading('axios', true)
    // },
    inventoryControl,
  ]
}

const mutations = {
  [types.EXPAND_MENU] (state, menuItem) {
    if (menuItem.index > -1) {
      if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
        state.items[menuItem.index].meta.expanded = menuItem.expanded
      }
    } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
      menuItem.item.meta.expanded = menuItem.expanded
    }
  }
}

export default {
  state,
  mutations
}
