/**
 * Created by zhuang_w-pc on 4/24/2017.
 */
import lazyLoading from './lazyLoading'

export default {
  name: 'Inventory Controol',
  path: '/inventory-control',
  meta: {
    icon: 'fa-bar-chart-o',
    expanded: false,
    link: 'inventory-control/inventory.vue'
  },
  component: lazyLoading('inventory-control', true),
  
  children: [
    {
      name: 'Inventory',
      path: 'inventory',
      component: lazyLoading('inventory-control/inventory'),
      meta: {
        link: 'inventory-control/inventory.vue'
      }
    },
    {
      name: 'Variant',
      path: 'variant',
      component: lazyLoading('inventory-control/variant'),
      meta: {
        link: 'inventory-control/variant.vue'
      }
    }
  ]
}
