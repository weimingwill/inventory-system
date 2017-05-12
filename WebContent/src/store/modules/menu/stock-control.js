/**
 * Created by zhuang_w-pc on 5/8/2017.
 */
import lazyLoading from './lazyLoading'

export default {
  title: 'Stock Control',
  path: '/stock-control',
  isMenu: true,
  meta: {
    icon: 'local_shipping',
    expanded: false,
    link: 'stock-control/Inbound.vue'
  },

  subItems: [
    {
      title: 'Inbound',
      path: '/inbound',
      router: true,
      isMenu: true,
      component: lazyLoading('stock-control/inbound'),
      meta: {
        link: 'stock-control/inbound.vue'
      }
    },
    {
      title: 'Outbound',
      path: '/outbound',
      router: true,
      isMenu: true,
      component: lazyLoading('stock-control/outbound'),
      meta: {
        link: 'stock-control/outbound.vue'
      }
    },
    {
      title: 'Adjustment',
      path: '/adjustment',
      router: true,
      isMenu: true,
      component: lazyLoading('stock-control/adjustment'),
      meta: {
        link: 'stock-control/outbound.vue'
      }
    },
    {
      path: '/inbound/view/:id',
      canReuse: false,
      isMenu: false,
      component: lazyLoading('purchasing/purchase-order-details')
    },
  ]
}
