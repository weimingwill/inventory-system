receiving.vuereceiving.vue<template>
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
        :purchaseOrders="toCheckOrders"
        :statuses="statuses"
        :headers="headers"
    ></purchase-order-content>
  </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import PurchaseOrderContent from '../purchasing/purchase-orders-content.vue'

  import { mapGetters, mapActions } from 'vuex'
  import * as s from '../../utils/setting'

  export default {

    name: 'Receiving',

    components: {
      Breadcrumbs,
      PurchaseOrderContent
    },

    computed: {
      ...mapGetters([
        'purchaseOrders',
      ]),

      toCheckOrders() {
        return this.purchaseOrders.filter(p => p.toChecks.length > 0);
      },

      headers() {
        let headers = s.PURCHASE_ORDER_BASE_HEADERS.slice();
        headers.splice(5, 0,
          {
            text: 'Checked',
            value: 'checked',
            left: true
          }, {
            text: 'Received At',
            value: 'receivedAt',
            left: true
          }
        );
        return headers;
      }
    },

    data () {
      return {
        breadcrumbs: [
          { text: 'Inbound' },
          { text: 'Quality Check' }
        ],
        searchContent: '',
        statuses: ['To Check']
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