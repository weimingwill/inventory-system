<template xmlns="http://www.w3.org/1999/html">
  <div>
    <breadcrumbs :items="breadcrumbs"></breadcrumbs>
    <v-card>
      <v-row class="purchase-header-row">
        <v-col xs2>
          <v-card-title>Order #
            <v-edit-dialog
                @open="order._orderNumber = order.orderNumber"
                @cancel="order.orderNumber = _orderNumber || order.orderNumber"
                lazy
            > {{ order.orderNumber? order.orderNumber : getNewOrderNumber }}
              <v-text-field
                  v-if="!isView"
                  slot="input"
                  label="Edit"
                  v-bind:value="order.orderNumber"
                  v-on:change="val => order.orderNumber = val"
                  single-line counter="counter"
              ></v-text-field>
              <v-icon v-if="!isView" class="edit-icon">edit</v-icon>
            </v-edit-dialog>
          </v-card-title>
        </v-col>

        <v-col xs8 pt-2>
          <v-row row>
            <v-col xs1>
              <v-subheader>Supplier:</v-subheader>
            </v-col>
            <v-col xs3>
              <v-subheader v-if="isView">{{ order.supplier }}</v-subheader>
              <v-select
                  v-else
                  v-bind:items="supplierNames"
                  v-model="order.supplier"
                  light
                  v-bind:rules="[() => order.supplier && order.supplier.length > 0 || 'Please select an option']"
                  v-validate="'required'"
              />
            </v-col>

            <v-col xs1 >
              <v-subheader>Contact:</v-subheader>
            </v-col>
            <v-col xs3>
              <v-subheader v-if="isView">{{ order.contact }}</v-subheader>
              <v-select
                  v-else
                  v-bind:items="supplierContacts"
                  v-model="order.contact"
                  light
                  v-bind:rules="[() => order.contact && order.contact.length > 0 || 'Please select an option']"
                  v-validate="'required'"
              />
            </v-col>
            <v-col xs1>
              <v-subheader>Warehouse:</v-subheader>
            </v-col>
            <v-col xs3>
              <v-subheader v-if="isView">{{ order.warehouse }}</v-subheader>
              <v-select
                  v-else
                  v-bind:items="warehouseLocations"
                  v-model="order.warehouse"
                  light
                  v-bind:rules="[() => order.warehouse && order.warehouse.length > 0 || 'Please select an option']"
                  v-validate="'required'"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col xs2 class="text-xs-right" v-if="isInbound">

          <adjustment-dialog
            :order="order"
            :variants="orderedItems"
            v-on:addAdjustment="reloadData"
          ></adjustment-dialog>

        </v-col>

        <v-col xs1 offset-xs1 v-else>
          <v-row>
            <v-col xs12><v-btn v-if="isView && !isInbound" outline small error>Void</v-btn></v-col>
          </v-row>
          <v-row>
            <v-col xs12><v-btn v-if="isView && !isInbound" small primary @click.native="editClicked">Edit</v-btn></v-col>
          </v-row>
        </v-col>

      </v-row>
    </v-card>
    <v-row>
      <v-col xs10>
        <v-container fluid id="items-container">

          <to-receive-items
              v-if="isInbound"
              :to-receive-items="toReceiveItems"
              :order="order"
              v-on:receivePurchase="reloadData"
          >
          </to-receive-items>

          <v-divider class="items-divider"></v-divider>

          <received-items
              v-if="receivedItems.length > 0"
              :received-items="receivedItems"
          >
          </received-items>

          <v-divider class="items-divider"></v-divider>

          <adjusted-items
              v-if="adjustedItems.length > 0"
              :adjusted-items="adjustedItems"
          >
          </adjusted-items>

          <order-items :ordered-items="orderedItems" :isView="isView"></order-items>

        </v-container>
      </v-col>
      <v-col xs2>
        <v-card id="order-summary-card">
          <purchase-summary
              :ordered-items="orderedItems"
              :order-details="order"
              :isEdit="isEdit"
              :isCreate="isCreate"
              v-on:createPurchase="validateOrder"
          >
          </purchase-summary>
        </v-card>

      </v-col>
    </v-row>
  </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import ToReceiveItems from './components/to-receive-items.vue'
  import OrderItems from './components/order-items.vue'
  import ReceivedItems from './components/received-items.vue'
  import AdjustmentDialog from './components/adjustment-dialog.vue'
  import AdjustedItems from './components/adjusted-items.vue'
  import PurchaseSummary from './components/purchase-order-summary.vue'
  import { mapGetters, mapActions } from 'vuex'
  import * as s from '../../utils/setting'

  let _ = require('lodash');

  export default {

    name: 'createPurchaseOrder',

    components: {
      Breadcrumbs,
      ToReceiveItems,
      OrderItems,
      ReceivedItems,
      AdjustmentDialog,
      AdjustedItems,
      PurchaseSummary
    },

    watch: {
      errors: {
        handler: function(val, oldVal) {
          _.forEach(this.rules, (val, key) => {
            this.rules[key] = [() => (this.errors.has(key) ? this.errors.first(key) : true)];
          });
        },
        deep: true
      },

      '$route' (to, from) {
        this.setAction();
        this.setSameHeight();
      }
    },

    computed: {
      ...mapGetters([
        'supplierNames',
        'warehouseLocations',
        'getNewOrderNumber',
        'getVariantById',
        'getSupplierById'
      ]),
      supplierContacts() {
        if (this.order.supplier) {
          return this.$store.getters.getSupplierContactsByName(this.order.supplier);
        } else {
          return []
        }
      },
    },

    methods: {
      ...mapActions([
        'createPurchase'
      ]),

      validateOrder() {
        console.log('validate order')
        this.$validator.validateAll()
        .then(() => {
          if (this.order.orderNumber === '') {
            this.order.orderNumber = this.getNewOrderNumber;
          }
          this.createPurchase({
            order: this.order,
            items: this.orderedItems
          });
          this.$router.replace('/purchaseOrders');
        })
        .catch(err => {
          console.log(err);
        });
      },

      editClicked () {
        this.$router.replace('/purchaseOrders/edit/' + this.orderId);
      },

      init() {
        this.setAction();
        this.reloadData();
      },

      setAction() {
        let urlsParts = window.location.href.split('/');
        urlsParts.pop();
        let action = urlsParts.pop();
        let personnel = urlsParts[urlsParts.length - 1];
        let parentText = '';
        let childText = '';

        if (personnel === 'purchaseOrders') {
          parentText = 'Purchase Orders';
          this.isInbound = false;
        } else if (personnel === 'inbound'){
          parentText = 'Inbound';
          this.isInbound = true;
        }

        if (action === 'view') {
          this.isView = true;
          this.isEdit = false;
          this.isCreate = false;
          childText = 'View purchase order';
        } else if (action === 'edit') {
          this.isEdit = true;
          this.isView = false;
          this.isCreate = false;
          childText = 'Edit purchase order';
        } else {
          this.isCreate = true;
          this.isView = false;
          this.isEdit = false;
          childText = 'Create New Purchase Order';
        }

        this.breadcrumbs = [
          {
            text: parentText,
            href: urlsParts.join('/'),
            target: '_self'
          },
          { text: childText }
        ];
      },

      setSameHeight () {
        // Set height of items container equal to summary container
        let $container = document.getElementById('items-container');
        let $card = document.getElementById('order-summary-card');
        let containerHeight = $container.offsetHeight;
        let cardHeight = $card.offsetHeight;
        if (containerHeight > cardHeight) {
          $card.style.height = containerHeight + 'px';
        }
      },

      reloadData () {
        console.log('reload data')
        this.$store.dispatch('initInventory');
        this.$store.dispatch('initInventory');
        this.$store.dispatch('initPurchasing');

        if (this.$route.params.id) {
          this.orderId = parseInt(this.$route.params.id);
          let purchaseOrder = this.$store.getters.getObjectByAttr(
            s.MODULE_PURCHASING, s.OBJ_PURCHASE_ORDERS, 'id', this.orderId
          );
          this.initOrder(purchaseOrder);
        }
      },

      initOrder (purchaseOrder) {
        // init order
        this.order = {
          supplierId: purchaseOrder.supplierId,
          supplier: this.getSupplierById(purchaseOrder.supplierId).name,
          supplierContactId: purchaseOrder.supplierContactId,
          contact: this.$store.getters.getObjectByAttr(
            s.MODULE_SUPPLIER, s.OBJ_SUPPLIER_CONTACTS, 'id', purchaseOrder.supplierContactId
          ).email,
          warehouse: this.$store.getters.getObjectByAttr(
            s.MODULE_WAREHOUSE, s.OBJ_WAREHOUSE, 'id', purchaseOrder.warehouseId
          ).location,
          warehouseId: purchaseOrder.warehouseId,
          orderNumber: purchaseOrder.orderNumber
        };

        // init orderedItems
        this.orderedItems = this.fulfillVariants(purchaseOrder.variants);

        // init toReceiveItems
        this.toReceiveItems = this.fulfillVariants(purchaseOrder.toReceives);

        this.receivedItems = purchaseOrder.receives;

        this.receivedItems = this.receivedItems.map(item => {
          item.variants = this.fulfillVariants(item.variants);
          return item;
        });

        this.adjustedItems = purchaseOrder.adjustments;
        this.adjustedItems = this.adjustedItems.map(item => {
          item.variants = this.fulfillVariants(item.variants);
          return item;
        });
        console.log(this.toReceiveItems);
      },

      fulfillVariants (items, value=true) {
        return items.map(item => {
          Object.assign(item, this.getVariantById(item.variantId));
          item.value = value;
          return item;
        });
      }
    },

    data () {
      return {
        breadcrumbs: [],
        order: {
          supplierId: '',
          supplier: '',
          contact: '',
          supplierContactId: '',
          warehouse: '',
          warehouseId: '',
          orderNumber: ''
        },
        orderedItems: [],
        toReceiveItems: [],
        receivedItems: [],
        adjustedItems: [],
        rules: {
          supplier:[]
        },
        isView: false,
        isEdit: false,
        isCreate: false,
        isInbound: false,
        orderId: ''
      }
    },

    created() {
      this.$store.dispatch('initWarehouse');
      this.$store.dispatch('initSupplier');
      this.init();
    },

    mounted () {
//      this.init();
    },

    updated () {
      this.setSameHeight();
    }

  }
</script>

<style scoped>
  @import "../../css/main.css";

  #order-summary-card {
    /*min-height: 350px;*/
    margin-top: -8px;
  }

  .purchase-header-row {
    padding: 10px 5px 5px 0;
  }

  .edit-icon {
    margin-left: 2px;
    font-size: 1.5rem;
  }

  .items-divider {
    margin: 30px 0 0 0;
  }

  .item-header {
    margin: 30px 0 0 30px;
  }
</style>