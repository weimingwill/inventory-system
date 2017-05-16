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
      <v-col xs12>
        <v-container fluid id="items-container">

          <v-stepper v-model="step" v-if="isInbound">
            <v-stepper-header>
              <v-stepper-step step="1" v-bind:complete="step > 1" editable edit-icon="input">
                Receiving
              </v-stepper-step>
              <v-divider />
              <v-stepper-step step="2" v-bind:complete="step > 2" editable edit-icon="security">
                Quality Check
              </v-stepper-step>
              <v-divider />
              <v-stepper-step step="3" editable edit-icon="dashboard">Storing</v-stepper-step>
            </v-stepper-header>

            <!-- Receiving -->
            <v-stepper-content step="1">
              <to-receive-items
                  v-if="toReceiveItems.length > 0"
                  :to-receive-items="toReceiveItems"
                  :order="order"
                  v-on:receivePurchase="reloadData"
              >
              </to-receive-items>

              <div v-else>
                <v-icon medium class="green--text text--darken-2 completed-icon">check_circle</v-icon>
                <h6 class="completed-text">
                  <span>All items are received at {{ order.receivedAt }}</span>
                </h6>
              </div>

              <received-items
                  v-if="receivedItems.length > 0"
                  :received-items="receivedItems"
              >
              </received-items>

            </v-stepper-content>

            <!-- Quality Check -->
            <v-stepper-content step="2">
              <to-check-items
                  v-if="toCheckItems.length > 0"
                  :to-check-items="toCheckItems"
                  :order="order"
                  v-on:checkPurchase="reloadData"
              >
              </to-check-items>

              <div v-else-if="toReceiveItems.length > 0">
                <v-icon medium class="orange--text text--darken-2 completed-icon">do_not_disturb</v-icon>
                <h6 class="not-completed-text">
                  <span>Some items are not received</span>
                </h6>
              </div>

              <div v-else>
                <v-icon medium class="green--text text--darken-2 completed-icon">check_circle</v-icon>
                <h6 class="completed-text">
                  <span>All items are checked at {{ order.checkedAt }}</span>
                </h6>
              </div>

              <checked-items
                  v-if="checkedItems.length > 0"
                  :checked-items="checkedItems"
              >
              </checked-items>
            </v-stepper-content>

            <!-- Storing -->
            <v-stepper-content step="3">
              <to-store-items
                  v-if="toStoreItems.length > 0"
                  :to-store-items="toStoreItems"
                  :order="order"
                  v-on:storePurchase="reloadData"
              >
              </to-store-items>

              <div v-else-if="toReceiveItems.length > 0 || toCheckItems.length > 0">
                <v-icon medium class="orange--text text--darken-2 completed-icon">do_not_disturb</v-icon>
                <h6 class="not-completed-text">
                  <span>Some items are not received or checked</span>
                </h6>
              </div>

              <div v-else>
                <v-icon medium class="green--text text--darken-2 completed-icon">check_circle</v-icon>
                <h6 class="completed-text">
                  <span>All items are stored at {{ order.storedAt }}</span>
                </h6>
              </div>

              <stored-items
                  v-if="storedItems.length > 0"
                  :stored-items="storedItems"
              >
              </stored-items>
            </v-stepper-content>
          </v-stepper>

          <adjusted-items
              v-if="adjustedItems.length > 0"
              :adjusted-items="adjustedItems"
          >
          </adjusted-items>

          <order-items :ordered-items="orderedItems" :isView="isView"></order-items>

        </v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs2 offset-xs10>
        <v-card id="order-summary-card" class="elevation-0">
          <purchase-summary
              :ordered-items="orderedItems"
              :order-details="order"
              :is-edit="isEdit"
              :is-create="isCreate"
              :is-inbound="isInbound"
              :status="order.status"
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
  import OrderItems from './components/order-items.vue'
  import ToReceiveItems from './components/to-receive-items.vue'
  import ReceivedItems from './components/received-items.vue'
  import ToCheckItems from './components/to-check-items.vue'
  import CheckedItems from './components/checked-items.vue'
  import ToStoreItems from './components/to-store-items.vue'
  import StoredItems from './components/stored-items.vue'
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
      OrderItems,
      ToReceiveItems,
      ReceivedItems,
      ToCheckItems,
      CheckedItems,
      ToStoreItems,
      StoredItems,
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
        // Todo: optimize the function by set reloading in condition: receive, check, adjust ...
        console.log('reload data');
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
          orderNumber: purchaseOrder.orderNumber,
          status: purchaseOrder.status,
          receivedAt: purchaseOrder.receivedAt,
          checkedAt: purchaseOrder.checkedAt,
          storedAt: purchaseOrder.storedAt
        };

        // init orderedItems
        this.orderedItems = this.fulfillVariants(purchaseOrder.variants);

        // init toReceiveItems
        this.toReceiveItems = this.fulfillVariants(purchaseOrder.toReceives);
        this.receivedItems = this.fulfillNestedVariants(purchaseOrder.receives);

        // init toCheckItems
        this.toCheckItems = this.fulfillVariants(purchaseOrder.toChecks);
        this.checkedItems = this.fulfillNestedVariants(purchaseOrder.checkedItems);

        // init toStoreItems
        this.toStoreItems = this.fulfillVariants(purchaseOrder.toStores);
        this.storedItems = this.fulfillNestedVariants(purchaseOrder.storedItems);

        this.adjustedItems = this.fulfillNestedVariants(purchaseOrder.adjustments);

        // init step
        switch (purchaseOrder.status) {
          case s.STATUS_RECEIVED:
            this.step = 2;
            break;
          case s.STATUS_CHECKED:
            this.step = 3;
            break;
          case s.STATUS_STORED:
            this.step = 3;
            break;
          default:
            this.step = 1;
        }
      },

      fulfillVariants (items, value=true) {
        return items.map(item => {
          Object.assign(item, this.getVariantById(item.variantId));
          item.value = value;
          return item;
        });
      },

      fulfillNestedVariants (items) {
        return items.map(item => {
          item.variants = this.fulfillVariants(item.variants);
          return item;
        });
      },
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
          orderNumber: '',
          status: '',
          receivedAt: '',
          checkedAt: '',
          storedAt: ''
        },
        orderedItems: [],
        toReceiveItems: [],
        receivedItems: [],
        toCheckItems: [],
        checkedItems: [],
        toStoreItems: [],
        storedItems: [],
        adjustedItems: [],
        rules: {
          supplier:[]
        },
        isView: false,
        isEdit: false,
        isCreate: false,
        isInbound: false,
        orderId: '',
        step: ''
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

  .completed-text, .not-completed-text {
    margin: 11px 0 0 2px;
    float: left;
  }

  .completed-text {
    color: #388e3c;
  }

  .not-completed-text {
    color: orange ;
  }

  .completed-icon {
    float: left;
    margin-left: 20px;
  }
</style>