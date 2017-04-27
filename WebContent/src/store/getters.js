const pkg = state => state.pkg
const app = state => state.app
const inventory = state => state.inventory
const device = state => state.app.device
const sidebar = state => state.app.sidebar
const effect = state => state.app.effect

const products = state => {
  return state.inventory.products.map(p => {
    p.value = false;
    p.supplier = state.inventory.suppliers.filter(s => s.id === p.supplierId)[0];
    p.brand = p.supplier.brand;
    p.supplier = p.supplier.name;
    return p})
}
const variants = state => state.inventory.variants
const suppliers = state => state.inventory.suppliers
const supplierContacts = state => state.inventory.supplierContacts
const supplierNames = state => state.inventory.suppliers.map(s => s.name)
const supplierBrands = state => state.inventory.suppliers.map(s => s.brand)
const productTypes = state => state.inventory.products.map(p => p.type)
const warehouseLocations = state => state.inventory.warehouses.map(w => w.location)

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
  supplierNames,
  supplierBrands,
  productTypes,
  warehouseLocations,
  
  device,
  sidebar,
  effect,
  menuitems,
  componententry
}
