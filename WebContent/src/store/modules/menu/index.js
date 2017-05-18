/**
 * Created by zhuang_w-pc on 4/24/2017.
 */
import * as types from '../../mutation-types'
import lazyLoading from './lazyLoading'
import inventoryControl from './inventory-control'
import purchasing from './purchasing'
import warehouse from './warehouse'
import supplier from './supplier'
import stockControl from './stock-control'
import inbound from './inbound'

// show: meta.label -> name
// name: component name
// meta.label: display label

const state = {
  items: [
    inventoryControl,
    purchasing,
    inbound,
    warehouse,
    supplier,
  ]
}

const mutations = {

}

export default {
  state,
  mutations
}
