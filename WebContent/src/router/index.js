import Vue from 'vue'
import Router from 'vue-router'
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
    }
  ]
})
