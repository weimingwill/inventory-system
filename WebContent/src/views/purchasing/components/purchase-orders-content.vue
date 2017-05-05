<template>
  <v-tabs>
    <v-tab-item
        v-for="i in 1" :key="i"
        v-bind:href="'#mobile-tabs-3-' + i"
        slot="activators"
    >
      All
      <!--Item {{ i }}-->
    </v-tab-item>
    <v-tab-content
        v-for="i in 1" :key="i"
        v-bind:id="'mobile-tabs-3-' + i"
        slot="content"
    >
      <v-card>
        <v-data-table
            v-bind:headers="headers"
            v-model="items"
            v-bind:search="searchContent"
            select-all
        >

          <template slot="items" scope="props" class="template-datatable">
            <td>
              <v-checkbox
                  hide-details
                  primary
                  v-model="props.item.value"
              ></v-checkbox>
            </td>
            <td>{{ props.item.orderNumber }}</td>
            <td>{{ getSupplierName(props.item.supplierId) }}</td>
            <td>
              <v-chip label class="table-chip green white--text">{{ props.item.status }}</v-chip>
            </td>
            <td>{{ totalReceivedQuantity(props.item.orderNumber) }}</td>
            <td>{{ totalQuantity(props.item.orderNumber) }}</td>
            <td>{{ totalCost(props.item.orderNumber) }}</td>
            <td>{{ props.item.due }}</td>
            <td>{{ props.item.allReceivedAt }}</td>
            <td>{{ props.item.created }}</td>
            <td>{{ props.item.updated }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-tab-content>
  </v-tabs>
</template>

<script>

  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: ['searchContent'],

    computed: {
      ...mapGetters({
        items: 'purchaseOrders',
        getSupplierName: 'getSupplierNameById',
        totalReceivedQuantity: 'getTotalReceiveQuantity',
        totalQuantity: 'getTotalQuantity',
        totalCost: 'getTotalCost'
      })
    },

    methods: {

    },

    created() {
      if (this.items.length === 0) {
        this.$store.dispatch('initWarehouse');
        this.$store.dispatch('initSupplier');
        this.$store.dispatch('initInventory');
        this.$store.dispatch('initPurchasing')
      }
    },

    data () {
      return {
        headers: [{
          text: 'Order #',
          left: true,
          sortable: false,
          value: 'orderNum',
        }, {
          text: 'Supplier',
          value: 'supplier',
          left: true
        }, {
          text: 'Status',
          value: 'status',
          left: true
        }, {
          text: 'Receive',
          value: 'receive',
          left: true
        }, {
          text: 'Quantity',
          value: 'quantity',
          left: true
        }, {
          text: 'Total Cost (S$)',
          value: 'totalCost',
          left: true
        }, {
          text: 'Due',
          value: 'due',
          left: true
        }, {
          text: 'Received At',
          value: 'receivedAt',
          left: true
        }, {
          text: 'Created',
          value: 'created',
          left: true
        }, {
          text: 'Updated',
          value: 'updated',
          left: true
        }],
        e3: ''
      }
    }
  }
</script>

<style scoped>
  .table-chip {
    margin: 0;
    padding: 0 8px;
    height: 25px;
    font-size: 13px;
  }

  .tabs__items {
    border-bottom-width: 0;
  }

  .datatable {
    margin-bottom: 200px;
  }

  .tools {
    margin-top: -10px;
  }

  .product-image {
    width: 40px;
    height: auto;
  }

  .image-td {
    padding-top: 6px!important;
  }
</style>
