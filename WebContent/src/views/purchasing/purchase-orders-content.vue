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
        class="tab-content"
    >
      <v-card>
        <v-data-table
            v-bind:headers="headers"
            v-model="items"
            v-bind:search="searchContent"
            rows-per-page="10"
            :rows-per-page-items="rowsPerPageItems"
        >

          <template slot="items" scope="props" class="template-datatable">
            <td class="order-td hidden"><input v-model="props.item.id"></td>
            <!--<td>-->
              <!--<v-checkbox-->
                  <!--hide-details-->
                  <!--primary-->
                  <!--v-model="props.item.value"-->
              <!--&gt;</v-checkbox>-->
            <!--</td>-->
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
            <td>{{ totalQuantity(props.item.orderNumber) }}</td>
            <td>{{ totalCost(props.item.orderNumber) }}</td>
            <td v-if="isToReceive">{{ props.item.due }}</td>
            <td v-if="isToReceive">
              <v-row>
                <v-col xs9>
                  <v-progress-linear v-model="props.item.receivedPercentage" height="10" info></v-progress-linear>
                </v-col>
                <v-col xs3 pt-2>
                  {{ props.item.receivedPercentage }}%
                </v-col>
              </v-row>
            </td>
            <td v-if="isToStore">
              <v-row>
                <v-col xs9>
                  <v-progress-linear v-model="props.item.storedPercentage" height="10" info></v-progress-linear>
                </v-col>
                <v-col xs3 pt-2>
                  {{ props.item.storedPercentage }}%
                </v-col>
              </v-row>
            </td>

            <td v-if="isToCheck">
              <v-row>
                <v-col xs9>
                  <v-progress-linear v-model="props.item.checkedPercentage" height="10" info></v-progress-linear>
                </v-col>
                <v-col xs3 pt-2>
                  {{ props.item.checkedPercentage }}%
                </v-col>
              </v-row>
            </td>
            <td v-if="isToCheck">{{ props.item.receivedAt }}</td>
            <td v-if="isToStore">{{ props.item.checkedAt }}</td>
            <td v-if="isToReceive && isToCheck && isToStore">{{ props.item.storedAt }}</td>

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
  import * as s from '../../utils/setting'

  export default {
    name: 'PurchaseOrderDetails',

    props: ['searchContent', 'purchaseOrders', 'statuses', 'headers'],

    computed: {
      ...mapGetters({
        getSupplierName: 'getSupplierNameById',
        getReceivedPercentage: 'receivedQuantityPercentage',
        totalReceivedQuantity: 'getTotalReceiveQuantity',
        totalQuantity: 'getTotalQuantity',
        totalCost: 'getTotalCost',
      })
    },

    methods: {
      ...mapActions([
        'toggleLoader'
      ]),
      rowOnClick: function (id) {
        this.toggleLoader()
        let routeTo = '/' + this.page + '/view/' + id;
        this.$router.replace(routeTo);
      },

      tabOnClick: function (status) {
        if (status === 'all') {
          this.items = this.purchaseOrders;
        } else {
          this.items = this.purchaseOrders.filter(order => order.status === status);
        }
      },

      setData () {
        let urlsParts = window.location.href.split('/');
        this.page = urlsParts.pop();
        // Two conditions: inbound and purchasing
        this.isInbound = this.page === s.INBOUND;
        this.isToReceive = this.page === s.RECEIVING;
        this.isToCheck = this.page === s.CHECKING;
        this.isToStore = this.page === s.STORING;
        if (this.page === s.PURCHASE_ORDERS) {
          this.isToReceive = true;
          this.isToCheck = true;
          this.isToStore = true;
        }
      },

      receivedPercentage (orderNumber) {
        return this.getReceivedPercentage(orderNumber);
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
      this.setData();
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
        page: '',
        isInbound: false,
        isToReceive: false,
        isToCheck: false,
        isToStore: false,
        items: [],
        rowsPerPageItems: [10, 15, 25, { text: "All", value: -1 }],
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

  .table__overflow {
    margin-bottom: 12rem !important;
  }
</style>

<style>
  .tabs__items{
    border: none !important;
  }
</style>
