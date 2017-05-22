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
        <v-btn outline success dark to="/purchaseOrders/create/purchaseOrderDetails" router>
          <v-icon left>add</v-icon>
          New Purchase Order
        </v-btn>
      </v-card-title>
    </div>
    <header></header>
    <purchase-order-content
        :search-content="searchContent"
        :purchaseOrders="purchaseOrders"
        :statuses="getInboundStatuses"
        :headers="headers"
    ></purchase-order-content>
  </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import PurchaseOrderContent from './purchase-orders-content.vue'
  import { mapGetters, mapActions } from 'vuex'
  import * as s from '../../utils/setting'

  export default {

    name: 'purchaseOrder',

    components: {
      Breadcrumbs,
      PurchaseOrderContent
    },

    computed: {
      ...mapGetters([
        'purchaseOrders',
        'getInboundStatuses'
      ]),

      headers () {
        let headers = s.PURCHASE_ORDER_BASE_HEADERS.slice();
        headers.splice(5, 0,
          {
            text: 'Due',
            value: 'due',
            left: true
          }, {
            text: 'Received',
            value: 'received',
            left: true
          }, {
            text: 'Checked',
            value: 'checked',
            left: true
          }, {
            text: 'Stored',
            value: 'stored',
            left: true
          }, {
            text: 'Received At',
            value: 'receivedAt',
            left: true
          }, {
            text: 'Checked At',
            value: 'checkedAt',
            left: true
          }, {
            text: 'Stored At',
            value: 'storedAt',
            left: true
          }
        );
        return headers;
      }
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