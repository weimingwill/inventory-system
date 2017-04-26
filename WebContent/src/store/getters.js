const pkg = state => state.pkg
const app = state => state.app
const device = state => state.app.device
const sidebar = state => state.app.sidebar
const effect = state => state.app.effect

const products = state => {
  return state.app.products.map(p => {
    p.value = false;
    p.supplier = state.app.suppliers.filter(s => s.id === p.supplierId)[0];
    p.brand = p.supplier.brand;
    p.supplier = p.supplier.name;
    return p})
}
const variants = state => state.app.variants
const suppliers = state => state.app.suppliers
const supplierContacts = state => state.app.supplierContacts

const menuitems = state => state.menu.items
const componententry = state => {
  return state.menu.items.filter(c => c.meta && c.meta.label === 'Components')[0]
}

export {
  pkg,
  app,
  
  products,
  variants,
  suppliers,
  supplierContacts,
  
  device,
  sidebar,
  effect,
  menuitems,
  componententry
}
