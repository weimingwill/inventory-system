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
      path: '/purchasingDashboard',
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
      title: 'Recommendations',
      path: '/recommendations',
      router: true,
      isMenu: true,
      component: lazyLoading('purchasing/recommendations'),
      meta: {
        link: 'purchasing/recommendations.vue'
      }
    },
    // {
    //   title: 'Reorder',
    //   path: '/reorder',
    //   router: true,
    //   isMenu: true,
    //   component: lazyLoading('purchasing/reorder'),
    //   meta: {
    //     link: 'purchasing/reorder.vue'
    //   }
    // },
    {
      path: '/purchaseOrders/create/purchaseOrderDetails',
      isMenu: false,
      component: lazyLoading('purchasing/purchase-order-details')
    },
    {
      path: '/purchaseOrders/create/purchaseOrderDetails/:number',
      isMenu: false,
      component: lazyLoading('purchasing/purchase-order-details')
    },
    {
      path: '/purchaseOrders/view/:id',
      canReuse: false,
      isMenu: false,
      component: lazyLoading('purchasing/purchase-order-details')
    },
    {
      path: '/purchaseOrders/edit/:id',
      canReuse: false,
      isMenu: false,
      component: lazyLoading('purchasing/purchase-order-details')
    },
    {
      path: '/recommendations/:type',
      canReuse: false,
      isMenu: false,
      component: lazyLoading('purchasing/recommendations')
    }
  ]
}
