/**
 * Created by zhuang_w-pc on 5/2/2017.
 */
export const MODULE_WAREHOUSE = 'warehouse';
export const OBJ_WARHEOUSE = 'warehouses';

export const MODULE_SUPPLIER = 'supplier';
export const OBJ_SUPPLIER = 'suppliers';
export const OBJ_SUPPLIER_CONTACTS = 'supplierContacts';

export const MODULE_INVENTORY = 'inventory';
export const OBJ_PRODUCT = 'products';
export const OBJ_VARIANTS = 'variants';

export const PURCHASE_ORDER_ATTR = [
  "id",
  "orderNumber",
  "supplierId",
  "warehouseId",
  "variants",
  "price",
  "status",
  "isReceived",
  "due",
  "allReceivedAt",
  "created",
  "updated",
  "value"];

export const PURCHASING_DASHBOARD_TITLES = [
  'Total Purchased Units',
  'Total Purchased Cost',
  'Average Unit Cost'
]

export const PURCHASING_DASHBOARD_UNITS = [
  '',
  '$',
  '$'
]