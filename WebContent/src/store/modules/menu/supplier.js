/**
 * Created by zhuang_w-pc on 4/24/2017.
 */
import lazyLoading from './lazyLoading'

export default {
  title: 'Supplier',
  path: '/supplier',
  isMenu: true,
  // router: true,
  meta: {
    icon: 'group',
    expanded: false,
    link: 'supplier/suppliers.vue'
  },
  // component: lazyLoading('supplier', true),
  subItems: [
    {
      title: 'Suppliers',
      path: '/suppliers',
      isMenu: true,
      router: true,
      component: lazyLoading('supplier/suppliers'),
      meta: {
        link: 'supplier/suppliers.vue'
      }
    },
    {
      title: 'Supplier Contacts',
      path: '/supplierContacts',
      isMenu: true,
      router: true,
      component: lazyLoading('supplier/supplierContacts'),
      meta: {
        link: 'supplier/supplierContacts.vue'
      }
    },
    {
      path: '/suppliers/:id/supplierContacts',
      isMenu: false,
      component: lazyLoading('supplier/supplierContacts'),
      meta: {
        link: 'supplier/supplierContacts.vue'
      }
    }, {
      path: '/suppliers/createSupplier',
      isMenu: false,
      component: lazyLoading('supplier/createSupplier'),
      meta: {
        link: 'supplier/createSupplier.vue'
      }
    }, {
      path: '/supplierContacts/createContact',
      isMenu: false,
      component: lazyLoading('supplier/createContact'),
      meta: {
        link: 'supplier/createContact.vue'
      }
    }
  ]
}
