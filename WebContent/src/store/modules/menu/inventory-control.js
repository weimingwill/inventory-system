/**
 * Created by zhuang_w-pc on 4/24/2017.
 */
import lazyLoading from './lazyLoading'

export default {
  title: 'Inventory Control',
  path: '/inventory-control',
  isMenu: true,
  meta: {
    icon: 'web_asset',
    expanded: false,
    link: 'inventory-control/product.vue'
  },
  // component: lazyLoading('inventory-control', true),
  
  subItems: [
    {
      title: 'Product',
      path: '/inventory',
      router: true,
      isMenu: true,
      component: lazyLoading('inventory-control/product'),
      meta: {
        link: 'inventory-control/product.vue'
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
      path: '/inventory/createProduct',
      isMenu: false,
      component: lazyLoading('inventory-control/create-product')
    },
    {
      path: '/variant/createVariant',
      isMenu: false,
      component: lazyLoading('inventory-control/create-variant')
    },
    {
      path: '/inventory/:id',
      isMenu: false,
      component: lazyLoading('inventory-control/product-variant')
    }
  ]
}
