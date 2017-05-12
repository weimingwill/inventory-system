<template>
  <v-tabs>
    <v-tab-item
        v-for="status in statuses" :key="status"
        v-bind:href="'#tab-' + status"
        slot="activators"
        class="tab"
    >
      {{ status }}
    </v-tab-item>
    <v-tab-content
        v-for="status in statuses" :key="status"
        v-bind:id="'tab-' + status"
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
            <td class="order-td hidden"><input v-model="props.item.id"></td>
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
              <v-chip
                  label class="table-chip white--text"
                  v-bind:class="{
                  green: props.item.status === 'purchased',
                  teal: props.item.status === 'received',
                  indigo: props.item.status === 'checked',
                  primary: props.item.status === 'stored'}"
              >
                {{ props.item.status }}
              </v-chip>
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
        purchaseOrders: 'purchaseOrders',
        getSupplierName: 'getSupplierNameById',
        totalReceivedQuantity: 'getTotalReceiveQuantity',
        totalQuantity: 'getTotalQuantity',
        totalCost: 'getTotalCost',
        statuses: 'getInboundStatuses'
      })
    },

    methods: {
      rowOnClick: function (id) {
        if (this.isInbound) {
          this.$router.replace('/inbound/view/' + id)
        } else {
          this.$router.replace('/purchaseOrders/view/' + id)
        }
      },

      tabOnClick: function (status) {
        if (status === 'all') {
          this.items = this.purchaseOrders;
        } else {
          this.items = this.purchaseOrders.filter(order => order.status === status);
        }
      },

      setPersonnel () {
        let urlsParts = window.location.href.split('/');
        // Two conditions: inbound and purchasing
        this.isInbound = urlsParts.pop() === 'inbound';
      }
    },

    created() {
      if (this.items.length === 0) {
        this.$store.dispatch('initWarehouse');
        this.$store.dispatch('initSupplier');
        this.$store.dispatch('initInventory');
        this.$store.dispatch('initPurchasing')
      }

      this.items = this.purchaseOrders;
    },

    mounted() {
      this.setPersonnel();
      // Add eventListener to tabs
      let $tabs = document.getElementsByClassName('tab');
      Array.from($tabs).forEach($tab => {
        let status = $tab.firstChild.href.split('-');
        $tab.addEventListener('click', () => this.tabOnClick(status[status.length - 1]));
      });

      let $orderIdTds = document.getElementsByClassName('order-td');
      Array.from($orderIdTds).forEach(($td) => {
        $td.parentNode.addEventListener('click', () => this.rowOnClick($td.firstChild.value))
      });

      // Do not go trigger click row if checkbox is clicked
      let $checkboxes = document.getElementsByClassName('checkbox');
      Array.from($checkboxes).forEach($checkbox => {
        $checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      });
    },

    updated() {

    },

    beforeDestroy() {
      let $orderIdTds = document.getElementsByClassName('supplier-td');
      Array.from($orderIdTds).forEach(($td) => {
        $td.parentNode.removeEventListener('click', () => this.rowOnClick($td.firstChild.value))
      });
    },

    data () {
      return {
        status: '',
        isInbound: false,
        items: [],

        headers: [{
          text: 'Order #',
          left: true,
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

  .datatable {
    margin-bottom: 200px;
  }

  .tools {
    margin-top: -10px;
  }

  table tbody tr:hover td {
    cursor: pointer !important;
  }
</style>
