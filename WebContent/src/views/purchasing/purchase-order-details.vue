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

        <v-col xs2 class="text-xs-right" v-if="isToReceive || isToCheck || isToStore">

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

          <!-- Receiving -->
          <div v-if="isToReceive">
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
          </div>

          <!-- Quality Check -->
          <div v-if="isToCheck">
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
          </div>

          <!-- Storing -->
          <div v-if="isToStore">
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
          </div>

          <adjusted-items
              v-if="adjustedItems.length > 0"
              :adjusted-items="adjustedItems"
          >
          </adjusted-items>

          <v-divider v-if="isToReceive || isToCheck || isToStore" class="items-divider"></v-divider>

          <order-items
              v-if="!isToCheck && !isToStore"
              :ordered-items="orderedItems"
              :isView="isView"
              :order="order"
          ></order-items>

        </v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs8 offset-xs1 class="pt-3">
        <demand-forecast
            v-if="recommendationNumber"
            :productType="recommendation.productType"></demand-forecast>
      </v-col>

      <v-col xs2 offset-xs1>
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
  import DemandForecast from './components/demand-forecast.vue'
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
      PurchaseSummary,
      DemandForecast
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
        'getSupplierById',
        'fulfillVariants',
        'fulfillNestedVariants',
        'getRecommendationByNumber',
        'getVariantsByTypeColorSize',
        'getSupplierByVariant',
        'getSupplierContactsByName',
        'getSupplierContactsBySupplierId'
      ]),
      supplierContacts() {
        if (this.order.supplier) {
          return this.getSupplierContactsByName(this.order.supplier);
        } else {
          return []
        }
      },
    },

    methods: {
      ...mapActions([
        'createPurchase',
        'handleRecommendation'
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

          if (this.recommendationNumber) {
            this.handleRecommendation(this.recommendationNumber);
          }

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

        switch (personnel) {
          case s.INBOUND:
            parentText = 'Inbound';
            this.isInbound = true;
            break;
          case s.RECEIVING:
            parentText = 'Receiving';
            this.isToReceive = true;
            break;
          case s.CHECKING:
            parentText = 'Checking';
            this.isToCheck = true;
            break;
          case s.STORING:
            parentText = 'Storing';
            this.isToStore = true;
            break;
          default:
            parentText = 'Purchasing';
            this.isInbound = false;
            this.isToReceive = false;
            this.isToCheck = false;
            this.isToStore = false;
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

        this.recommendationNumber = this.$route.params.number;
        if (this.recommendationNumber) {
          this.setRecommendation(this.recommendationNumber);
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

      setRecommendation (number) {
        this.recommendation = this.getRecommendationByNumber(number);
        Array.from(this.recommendation.variants).forEach(variant => {
          let variants = this.getVariantsByTypeColorSize(this.recommendation.productType, variant.color, variant.size);
          variants = variants.map(v => {
            v.quantity = variant.quantity;
            return v;
          });
          this.orderedItems = this.orderedItems.concat(variants);

        });

        let supplier = this.getSupplierByVariant(this.orderedItems[0]);
        this.order.supplierId = supplier.id;
        this.order.supplier = supplier.name;
        this.order.warehouse = this.warehouseLocations[0];
        let supplierContacts = this.getSupplierContactsBySupplierId(supplier.id);
        this.order.contact = supplierContacts[0].email;
        this.order.supplierContactId = supplierContacts[0].id;
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
        this.$store.dispatch('initWarehouse');
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
          id: purchaseOrder.id,
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

        this.toReceiveItems = this.fulfillVariants(purchaseOrder.toReceives);
        this.toCheckItems = this.fulfillVariants(purchaseOrder.toChecks);
        this.toStoreItems = this.fulfillVariants(purchaseOrder.toStores);

        // init receivedItems
        if (this.isToReceive) {
          this.receivedItems = this.fulfillNestedVariants(purchaseOrder.receives);
        }

        // init checkedItems
        if (this.isToCheck) {
          this.checkedItems = this.fulfillNestedVariants(purchaseOrder.checkedItems);
        }

        // init storedItems
        if (this.isToStore) {
          this.storedItems = this.fulfillNestedVariants(purchaseOrder.storedItems);
        }

        this.adjustedItems = this.fulfillNestedVariants(purchaseOrder.adjustments);
      }
    },

    data () {
      return {
        breadcrumbs: [],
        order: {
          id: '',
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
        isToReceive: false,
        isToCheck: false,
        isToStore: false,
        orderId: '',

        // recommendations
        recommendationNumber: '',
        recommendation: {}
      }
    },

    created() {
      this.$store.dispatch('initSupplier');
      this.init();
      this.$store.dispatch('setLoader', false);
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