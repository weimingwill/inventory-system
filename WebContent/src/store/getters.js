const pkg = state => state.pkg
const app = state => state.app
const inventory = state => state.inventory
const device = state => state.app.device
const sidebar = state => state.app.sidebar
const effect = state => state.app.effect


const menuitems = state => state.menu.items

const componententry = state => {
  return state.menu.items.filter(c => c.meta && c.meta.label === 'Components')[0]
};

// Todo: refactor all functions with this type

const getObjectByAttr = state => (moduleName, objName, attrName, attrValue) => {
  return state[moduleName][objName].find(obj => obj[attrName] === attrValue);
};

const getObjectListByAttr = state => (moduleName, objName, attrName, attrValue) => {
  return state[moduleName][objName].filter(obj => obj[attrName] === attrValue);
};

export {
  pkg,
  app,
  
  inventory,
  
  device,
  sidebar,
  effect,
  menuitems,
  componententry,
  getObjectByAttr,
  getObjectListByAttr
}
