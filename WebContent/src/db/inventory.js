/**
 * Created by zhuang_w-pc on 5/2/2017.
 */
import * as dbKey from './setting'


function addProduct(product) {
  let products = JSON.parse(localStorage.getItem(dbKey.PRODUCTS));
  products.push(product);
  localStorage.setItem(dbKey.PRODUCTS, JSON.stringify(products));
}

function addVariants(newVariants) {
  let variants = localStorage.getItem(dbKey.VARIANTS);
  variants.concat(newVariants);
  localStorage.setItem(dbKey.VARIANTS, JSON.stringify(variants));
}

function updateVariants(variants) {
  localStorage.setItem(dbKey.VARIANTS, JSON.stringify(variants));
}


export {
  addProduct,
  addVariants,
  updateVariants
}