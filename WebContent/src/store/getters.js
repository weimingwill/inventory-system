const pkg = state => state.pkg
const app = state => state.app
const inventory = state => state.inventory
const device = state => state.app.device
const sidebar = state => state.app.sidebar
const effect = state => state.app.effect

const products = state => state.inventory.products
const variants = state => state.inventory.variants
const suppliers = state => state.inventory.suppliers
const supplierContacts = state => state.inventory.supplierContacts
const menuitems = state => state.menu.items

const componententry = state => {
  return state.menu.items.filter(c => c.meta && c.meta.label === 'Components')[0]
}

export {
  pkg,
  app,
  
  inventory,
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
