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
      </v-card-title>
    </div>
    <purchase-order-content
        :search-content="searchContent"
        :purchaseOrders="purchaseOrders"
        :statuses="getInboundStatuses"
    ></purchase-order-content>
  </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import PurchaseOrderContent from '../purchasing/purchase-orders-content.vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {

    name: 'Inbound',

    components: {
      Breadcrumbs,
      PurchaseOrderContent
    },

    computed: {
      ...mapGetters([
        'purchaseOrders',
        'getInboundStatuses'
      ])
    },

    data () {
      return {
        breadcrumbs: [
          { text: 'Inbound' }
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