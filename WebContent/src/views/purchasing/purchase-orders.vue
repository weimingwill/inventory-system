<template>
  <div>
    <breadcrumbs :items="breadcrumbs"></breadcrumbs>
    <div class="tool-card">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="searchContent"
        ></v-text-field>
        <v-btn outline success dark to="/purchasing/purchaseOrders/createPurchaseOrder" router>
          <v-icon left>add</v-icon>
          New Purchase Order
        </v-btn>
      </v-card-title>
    </div>
    <header></header>
    <purchase-order-content :search-content="searchContent"></purchase-order-content>
  </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import PurchaseOrderContent from './components/purchase-orders-content.vue'

  export default {

    name: 'purchaseOrder',

    components: {
      Breadcrumbs,
      PurchaseOrderContent
    },

    data () {
      return {
        breadcrumbs: [
          { text: 'Purchasing Orders' }
        ],
        searchContent: '',
      }
    },

    created() {
      this.$store.dispatch('initWarehouse');
      this.$store.dispatch('initSupplier');
      this.$store.dispatch('initInventory');
      this.$store.dispatch('initPurchasing');
    },

  }
</script>

<style scoped>
  .tool-card {
    margin: -100px 0 -1px 0;
    right: 0;
  }
</style>