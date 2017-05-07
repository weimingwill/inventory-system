/**
 * Created by zhuang_w-pc on 4/24/2017.
 */
import lazyLoading from './lazyLoading'

export default {
  title: 'Purchasing',
  path: '/purchasing',
  isMenu: true,
  meta: {
    icon: 'shopping_cart',
    expanded: false,
    link: 'purchasing/dashboard.vue'
  },

  subItems: [
    {
      title: 'Dashboard',
      path: '/purchasing',
      router: true,
      isMenu: true,
      component: lazyLoading('purchasing/dashboard'),
      meta: {
        link: 'purchasing/dashboard.vue'
      }
    },
    {
      title: 'Purchase Orders',
      path: '/purchasing/purchaseOrders',
      router: true,
      isMenu: true,
      component: lazyLoading('purchasing/purchase-orders'),
      meta: {
        link: 'purchasing/purchase-orders.vue'
      }
    },
    {
      title: 'Reorder',
      path: '/purchasing/reorder',
      router: true,
      isMenu: true,
      component: lazyLoading('purchasing/reorder'),
      meta: {
        link: 'purchasing/reorder.vue'
      }
    },
    {
      path: '/purchasing/createPurchaseOrder',
      isMenu: false,
      component: lazyLoading('purchasing/create-purchase-order')
    }
  ]
}
