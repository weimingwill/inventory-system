/**
 * Created by zhuang_w-pc on 5/2/2017.
 */
export const MODULE_INVENTORY = 'inventory';
export const OBJ_PRODUCTS = 'products';
export const OBJ_VARIANTS = 'variants';

export const MODULE_SUPPLIER = 'supplier';
export const OBJ_SUPPLIER = 'suppliers';
export const OBJ_SUPPLIER_CONTACTS = 'supplierContacts';

export const MODULE_WAREHOUSE = 'warehouse';
export const OBJ_WAREHOUSE = 'warehouses';
export const OBJ_SHELVES = 'shelves';
export const OBJ_LAYERS = 'layers';
export const OBJ_CELLS = 'cells';
export const OBJ_CELL_VARIANT = 'cellVariantJoins';

export const MODULE_PURCHASING = 'purchasing';
export const OBJ_PURCHASE_ORDERS = 'purchaseOrders';


export const PURCHASE_ORDER_ATTR = [
  "id",
  "orderNumber",
  "supplierId",
  "warehouseId",
  "supplierContactId",
  "variants",
  "price",
  "status",
  "received",
  "due",
  "receivedAt",
  "created",
  "updated",
  "value"];

export const PURCHASING_DASHBOARD_TITLES = [
  'Total Purchased Units',
  'Total Purchased Cost',
  'Average Unit Cost'
];

export const PURCHASING_DASHBOARD_UNITS = [
  '',
  '$',
  '$'
];

export const ALL = 'all';
export const STATUS_PURCHASED = 'purchased';
export const STATUS_RECEIVED = 'received';
export const STATUS_ACTIVE = 'active';
export const STATUS_PICKED = 'picked';
export const STATUS_PACKED = 'packed';
export const STATUS_STORED = 'stored';
export const STATUS_CHECKED = 'checked';

export const PROCESS_RECEIVING = 'Receiving';
export const PROCESS_CHECKING = 'Checking';
export const PROCESS_STORING = 'Storing';
export const PROCESS_PICKING = 'Picking';
export const PROCESS_REGULAR_CHECK = 'Regular check';
export const ADJUST_STATUSES = [PROCESS_RECEIVING, PROCESS_CHECKING, PROCESS_STORING, PROCESS_PICKING, PROCESS_REGULAR_CHECK];

export const ADJUST_REASONS = [
  'Damaged',
  'Wrong Item',
  'Quality Issue'
];

export const INCREASE= 'increase'
export const DECREASE = 'decrease'

export const AVAILABLE = 'available'
export const ONHAND = 'onHand'
export const COMMITTED = 'committed'
export const SOLD = 'sold'
export const INCOMING = 'incoming'
export const INBOUNDING = 'inbounding'
export const OUTBOUNDING = 'outbounding'