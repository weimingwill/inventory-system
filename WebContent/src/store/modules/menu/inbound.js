/**
 * Created by zhuang_w-pc on 5/8/2017.
 */
import lazyLoading from './lazyLoading'

export default {
  title: 'Inbound',
  path: '/inbound',
  isMenu: true,
  meta: {
    icon: 'local_shipping',
    expanded: false,
    link: 'stock-control/Inbound.vue'
  },

  subItems: [
    {
      title: 'Receiving',
      path: '/receiving',
      router: true,
      isMenu: true,
      component: lazyLoading('inbound/receiving'),
      meta: {
        link: 'inbound/receiving.vue'
      }
    },
    {
      title: 'Quality Check',
      path: '/checking',
      router: true,
      isMenu: true,
      component: lazyLoading('inbound/checking'),
      meta: {
        link: 'inbound/checking.vue'
      }
    },
    {
      title: 'Storing',
      path: '/storing',
      router: true,
      isMenu: true,
      component: lazyLoading('inbound/storing'),
      meta: {
        link: 'inbound/storing.vue'
      }
    },
    {
      path: '/receiving/view/:id',
      canReuse: false,
      isMenu: false,
      component: lazyLoading('purchasing/purchase-order-details')
    },
    {
      path: '/checking/view/:id',
      canReuse: false,
      isMenu: false,
      component: lazyLoading('purchasing/purchase-order-details')
    },
    {
      path: '/storing/view/:id',
      canReuse: false,
      isMenu: false,
      component: lazyLoading('purchasing/purchase-order-details')
    },
  ]
}
