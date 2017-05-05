<template>
  <div>
    <breadcrumbs :items="breadcrumbs"></breadcrumbs>
    <v-card>
      <v-row class="purchase-header-row">
        <v-col xs2>
          <v-card-title>Order #P0001</v-card-title>
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
                  v-bind:rules="[() => order.contact && order.contact.length > 0 || 'Please select an option']"
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
          <order-items :ordered-items="items"></order-items>
          <!--<received-items></received-items>-->
          <!--<adjust-items></adjust-items>-->
        </v-container>
      </v-col>
      <v-col xs2>
        <purchase-summary :ordered-items="items"></purchase-summary>
      </v-col>
    </v-row>
  </div>


</template>

<script>
  import Breadcrumbs from '../breadcrumbs.vue'
  import PurchaseSummary from '../purchasing/components/create-purchase-order-summary.vue'

  import OrderItems from './components/order-items.vue'

  import { mapGetters, mapActions } from 'vuex'

  export default {

    name: 'createPurchaseOrder',

    watch: {
      items: function () {
        this.summaryItems = this.items
      }
    },

    computed: {
      ...mapGetters([
        'supplierNames',
        'warehouseLocations'
      ]),

      supplierContacts() {
        if (this.order.supplier) {
          return this.$store.getters.getSupplierContactsByName(this.order.supplier);
        } else {
          return []
        }
      },
    },

    components: {
      Breadcrumbs,
      OrderItems,
      PurchaseSummary
    },

    created() {
      this.$store.dispatch('initWarehouse');
      this.$store.dispatch('initSupplier');
      this.$store.dispatch('initInventory');
      this.$store.dispatch('initPurchasing');
    },

    data () {
      return {
        breadcrumbs: [
          {
            text: 'purchasing',
            href: window.location.href.replace('createPurchaseOrder', 'purchasing'),
            target: '_self'
          },
          { text: 'Create New Purchase Order'}

        ],
        order: {
          supplier: '',
          contact: '',
          warehouse: '',
        },
        items: [],
        summaryItems: []
      }
    }
  }
</script>

<style scoped>
  .purchase-header-row {
    padding: 10px 5px 5px 0;
  }
</style>