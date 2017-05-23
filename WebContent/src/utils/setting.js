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

export const PURCHASE_ORDER_BASE_HEADERS = [{
  text: 'Order #',
  left: true,
  value: 'orderNum',
}, {
  text: 'Supplier',
  value: 'supplier',
  left: true
}, {
  text: 'Status',
  value: 'status',
  left: true
}, {
  text: 'Quantity',
  value: 'quantity',
  left: true
}, {
  text: 'Total Cost (S$)',
  value: 'totalCost',
  left: true
}, {
  text: 'Created',
  value: 'created',
  left: true
}, {
  text: 'Updated',
  value: 'updated',
  left: true
}]

export const RECEIVING = 'receiving'
export const CHECKING = 'checking'
export const STORING = 'storing'
export const INBOUND = 'inbound'
export const PURCHASE_ORDERS = 'purchaseOrders'

export const ALLOCATION_HEADERS = [{
  text: '',
  left: true,
  value: 'image',
}, {
  text: 'Name',
  left: true,
  value: 'name',
  // sortable: false,
}, {
  text: 'Quantity',
  left: true,
  value: 'quantity',
  // sortable: false,
}, {
  text: 'Location',
  left: true,
  value: 'location',
  // sortable: false,
},
//   {
//   text: 'Layer',
//   left: true,
//   value: 'layer',
//   sortable: false,
// }, {
//   text: 'Cell',
//   left: true,
//   value: 'cell',
//   sortable: false,
// }
]

export const WAREHOUSE_COLORS = [
  {
    label: 'Popular',
    base: '#ffffcc',
    color: '#fcec85',
    type: 'popular'
  }, {
    label: 'Cross Docking',
    base: '#ffcccc',
    color: '#ed8c7d',
    type: 'crossDocking'
  }, {
    supplierId: -1,
    label: 'Adjustment',
    base: '#ffdec7',
    color: '#ffbb99',
    type: 'common'
  }, {
    supplierId: 0,
    label: 'To Supplier',
    base: '#c1b1cc',
    color: '#6c71cc',
    type: 'common'
  }, {
    supplierId: 1,
    label: 'Levi\'s',
    base: '#efffe5',
    color: '#c4e8ae',
    type: 'common'
  }, {
    supplierId: 2,
    label: 'Cotton On',
    base: '#c3d7ff',
    color: '#6aadff',
    type: 'common'
  }, {
    supplierId: 3,
    label: 'Jack & Jones',
    base: '#cdf1ff',
    color: '#7dd2db',
    type: 'common'
  }
]

export const USER_MENU = {
  'purchasing': ['Inventory Control', 'Purchasing', 'Supplier'],
  'inbound': ['Inbound', 'Warehouse'],
  'admin': ['Inventory Control', 'Purchasing', 'Supplier', 'Inbound', 'Warehouse']
};