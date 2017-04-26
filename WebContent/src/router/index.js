import Vue from 'vue'
import Router from 'vue-router'
import menuModule from 'vuex-store/modules/menu'
import Hello from '../components/Hello.vue'
import Sidebar from '../components/layout/Sidebar.vue'
import AppMain from '../components/layout/AppMain.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: require('../views/Home')
    },
    ...generateRoutesFromMenu(menuModule.state.items)
  ]
})

function generateRoutesFromMenu (menu = [], routes = []) {
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i]
    if (item.path) {
      routes.push(item)
    }
    if (!item.component) {
      generateRoutesFromMenu(item.subItems, routes)
    }
  }
  return routes
}
