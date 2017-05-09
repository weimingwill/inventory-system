/**
 * Created by zhuang_w-pc on 5/8/2017.
 */
import lazyLoading from './lazyLoading'

export default {
  title: 'Warehouse',
  path: '/warehouse',
  isMenu: true,
  router: true,
  meta: {
    icon: 'domain',
    expanded: false,
    link: 'warehouse/index.vue'
  },
  component: lazyLoading('warehouse', true),
}
