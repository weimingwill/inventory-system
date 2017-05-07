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
                    slot="input"
                    label="Edit"
                    v-bind:value="order.orderNumber"
                    v-on:change="val => order.orderNumber = val"
                    single-line counter="counter"
                ></v-text-field>
                <v-icon class="edit-icon">edit</v-icon>
              </v-edit-dialog>
            </v-card-title>
          </v-col>

          <v-col xs8>
            <v-row row>
              <v-col xs1>
                <v-subheader>Supplier</v-subheader>
              </v-col>
              <v-col xs3>
                <v-select
                    v-bind:items="supplierNames"
                    v-model="order.supplier"
                    light
                    v-bind:rules="[() => order.supplier && order.supplier.length > 0 || 'Please select an option']"
                    v-validate="'required'"
                />
              </v-col>

              <v-col xs1 >
                <v-subheader>Email</v-subheader>
              </v-col>
              <v-col xs3>
                <v-select
                    v-bind:items="supplierContacts"
                    v-model="order.contact"
                    light
                    label="Select"
                    v-bind:rules="[() => order.contact && order.contact.length > 0 || 'Please select an option']"
                    v-validate="'required'"
                />
              </v-col>
              <v-col xs1>
                <v-subheader>Warehouse</v-subheader>
              </v-col>
              <v-col xs3>
                <v-select
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
              <v-col xs12><v-btn outline small error>Void</v-btn></v-col>
            </v-row>
            <v-row>
              <v-col xs12><v-btn small primary>Edit</v-btn></v-col>
            </v-row>

          </v-col>

        </v-row>
    </v-card>
    <v-row>
      <v-col xs10>
        <v-container fluid class="items-container">
          <order-items :ordered-items="orderedItems"></order-items>
          <!--<received-items></received-items>-->
          <!--<adjust-items></adjust-items>-->
        </v-container>
      </v-col>
      <v-col xs2>
        <purchase-summary
            :ordered-items="orderedItems" :order-details="order"
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
  let _ = require('lodash');


  import { mapGetters, mapActions } from 'vuex'

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
          this.$router.replace('/purchasing/purchaseOrders');
        })
        .catch(err => {
          console.log(err);
        });
      }
    },

    data () {
      return {
        breadcrumbs: [
          {
            text: 'purchasing',
            href: window.location.href.replace('createPurchaseOrder', 'purchaseOrders'),
            target: '_self'
          },
          { text: 'Create New Purchase Order'}

        ],
        order: {
          supplier: '',
          contact: '',
          warehouse: '',
          orderNumber: ''
        },
        orderedItems: [],
        rules: {
          supplier:[]
        }
      }
    }
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