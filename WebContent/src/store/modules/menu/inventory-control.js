/**
 * Created by zhuang_w-pc on 4/24/2017.
 */
import lazyLoading from './lazyLoading'

const FOLDER = 'inventory-control/';

export default {
  title: 'Inventory Control',
  path: '/inventory-control',
  isMenu: true,
  meta: {
    icon: 'web_asset',
    expanded: false,
    link: 'inventory-control/inventory.vue'
  },
  // component: lazyLoading('inventory-control', true),
  
  subItems: [
    {
      title: 'Inventory',
      path: '/inventory',
      router: true,
      isMenu: true,
      component: lazyLoading('inventory-control/inventory'),
      meta: {
        link: 'inventory-control/inventory.vue'
      }
    },
    {
      title: 'Variant',
      path: '/variant',
      router: true,
      isMenu: true,
      component: lazyLoading('inventory-control/variant'),
      meta: {
        link: 'inventory-control/variant.vue'
      }
    },
    {
      path: '/createProduct',
      isMenu: false,
      component: lazyLoading('inventory-control/create-product')
    }
  ]
}
