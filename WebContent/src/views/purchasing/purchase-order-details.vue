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

        <v-col xs1 offset-xs1>
          <v-row>
            <v-col xs12><v-btn v-if="isView" outline small error>Void</v-btn></v-col>
          </v-row>
          <v-row>
            <v-col xs12><v-btn v-if="isView" small primary @click.native="editClicked">Edit</v-btn></v-col>
          </v-row>
        </v-col>

      </v-row>
    </v-card>
    <v-row>
      <v-col xs10>
        <v-container fluid class="items-container">
          <order-items :ordered-items="orderedItems" :isView="isView"></order-items>
          <!--<received-items></received-items>-->
          <!--<adjust-items></adjust-items>-->
        </v-container>
      </v-col>
      <v-col xs2>
        <purchase-summary
            :ordered-items="orderedItems"
            :order-details="order"
            :isEdit="isEdit"
            :isCreate="isCreate"
            v-on:createPurchase="validateOrder"
        >
        </purchase-summary>
      </v-col>
    </v-row>
  </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import OrderItems from './components/order-items.vue'
  import PurchaseSummary from './components/create-purchase-order-summary.vue'
  import { mapGetters, mapActions } from 'vuex'
  import * as s from '../../utils/setting'

  let _ = require('lodash');



  export default {

    name: 'createPurchaseOrder',

    components: {
      Breadcrumbs,
      OrderItems,
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
      }
    },

    computed: {
      ...mapGetters([
        'supplierNames',
        'warehouseLocations',
        'getNewOrderNumber'
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

        if (this.$route.params.id) {
          this.orderId = parseInt(this.$route.params.id);
          let purchaseOrder = this.$store.getters.getObjectByAttr(
            s.MODULE_PURCHASING, s.OBJ_PURCHASE_ORDERS, 'id', this.orderId
          );
          this.initOrder(purchaseOrder);
        }
      },

      setAction() {
        let urlsParts = window.location.href.split('/');
        urlsParts.pop();
        let action = urlsParts.pop();
        let breadCrumbText = '';

        if (action === 'view') {
          this.isView = true;
          this.isEdit = false;
          this.isCreate = false;
          breadCrumbText = 'View purchase order';
        } else if (action === 'edit') {
          this.isEdit = true;
          this.isView = false;
          this.isCreate = false;
          breadCrumbText = 'Edit purchase order';
        } else {
          this.isCreate = true;
          this.isView = false;
          this.isEdit = false;
          breadCrumbText = 'Create New Purchase Order';
        }

        this.breadcrumbs = [
          {
            text: 'Purchase Order',
            href: urlsParts.join('/'),
            target: '_self'
          },
          { text: breadCrumbText }
        ];
      },

      initOrder(purchaseOrder) {
        // init order
        this.order = {
          supplier: this.$store.getters.getSupplierById(purchaseOrder.supplierId).name,
          contact: this.$store.getters.getObjectByAttr(
            s.MODULE_SUPPLIER, s.OBJ_SUPPLIER_CONTACTS, 'id', purchaseOrder.supplierContactId
          ).email,
          warehouse: this.$store.getters.getObjectByAttr(
            s.MODULE_WAREHOUSE, s.OBJ_WAREHOUSE, 'id', purchaseOrder.warehouseId
          ).location,
          orderNumber: purchaseOrder.orderNumber
        };

        // init orderedItems
        for (let i = 0; i < purchaseOrder.variants.length; i++) {
          let variant = purchaseOrder.variants[i];
          Object.assign(variant, this.$store.getters.getVariantById(variant.variantId));
          this.orderedItems.push(variant);
        }
      },
    },

    data () {
      return {
        breadcrumbs: [],
        order: {
          supplier: '',
          contact: '',
          warehouse: '',
          orderNumber: ''
        },
        orderedItems: [],
        rules: {
          supplier:[]
        },
        isView: false,
        isEdit: false,
        isCreate: false,
        orderId: ''
      }
    },

    created() {
      this.$store.dispatch('initWarehouse');
      this.$store.dispatch('initSupplier');
      this.$store.dispatch('initInventory');
      this.$store.dispatch('initPurchasing');
    },

    mounted () {
      this.init();
    },

  }
</script>

<style scoped>
  .purchase-header-row {
    padding: 10px 5px 5px 0;
  }

  .edit-icon {
    margin-left: 2px;
    font-size: 1.5rem;
  }
</style>