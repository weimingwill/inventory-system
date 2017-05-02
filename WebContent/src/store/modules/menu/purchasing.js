/**
 * Created by zhuang_w-pc on 4/24/2017.
 */
import lazyLoading from './lazyLoading'

export default {
  title: 'Purchasing',
  path: '/purchasing',
  isMenu: true,
  meta: {
    icon: 'add_shopping_cart',
    expanded: false,
    link: 'purchasing/dashboard.vue'
  },
  // component: lazyLoading('purchasing', true),
  
  subItems: [
    {
      title: 'Dashboard',
      path: '/dashboard',
      router: true,
      isMenu: true,
      component: lazyLoading('purchasing/dashboard'),
      meta: {
        link: 'purchasing/dashboard.vue'
      }
    },
    {
      title: 'Purchase Orders',
      path: '/purchaseOrders',
      router: true,
      isMenu: true,
      component: lazyLoading('purchasing/purchase-orders'),
      meta: {
        link: 'purchasing/purchase-orders.vue'
      }
    },
    {
      path: '/createPurchaseOrder',
      isMenu: false,
      component: lazyLoading('purchasing/create-purchase-order')
    }
  ]
}
