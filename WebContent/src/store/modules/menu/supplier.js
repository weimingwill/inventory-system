/**
 * Created by zhuang_w-pc on 4/24/2017.
 */
import lazyLoading from './lazyLoading'

export default {
  title: 'Supplier',
  path: '/supplier',
  isMenu: true,
  meta: {
    icon: 'group',
    expanded: false,
    link: 'supplier/index.vue'
  },
  component: lazyLoading('supplier', true),
}
