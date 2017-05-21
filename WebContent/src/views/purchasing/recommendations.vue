<template>
  <div>
    <breadcrumbs :items="breadcrumbs" :isSlim="true"></breadcrumbs>
    <v-card>
      <v-data-table
          v-bind:headers="headers"
          v-model="tableItems"
          v-bind:search="searchContent"
          rows-per-page="10"
          :rows-per-page-items="rowsPerPageItems"
      >

        <template slot="items" scope="props">
          <td class="recommend-td hidden"><input v-model="props.item.number"></td>
          <td>{{ props.item.number }}</td>
          <td>
            <v-chip
                label class="table-chip white--text"
                v-bind:class="{
                  green: props.item.type === 'new',
                  primary: props.item.type === 'reorder'}"
            >
              {{ props.item.type }}
            </v-chip>
          </td>
          <td>{{ props.item.productType }}</td>
          <td>{{ props.item.quantity }}</td>
          <td>{{ props.item.importance }}</td>
          <td>{{ props.item.isHandled }}</td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Recommendations',

    components: {
      Breadcrumbs
    },

    computed: {
      ...mapGetters([
        'toPurchaseNew',
        'toReorder',
        'recommendations'
      ])
    },

    methods: {
      rowOnClick: function (number) {
        console.log('row clicked', number);
        let routeTo = '/purchaseOrders/create/purchaseOrderDetails/' + number;
        this.$router.replace(routeTo);
      },

      setData () {
        let urlsParts = window.location.href.split('/');
        let page = urlsParts.pop();
        switch (page) {
          case 'new':
            this.tableItems = this.toPurchaseNew;
            break;
          case 'reorder':
            this.tableItems = this.toReorder;
            break;
          default:
            this.tableItems = this.recommendations;
        }
      },

      addRowEvent () {
        let $recommendTds = document.getElementsByClassName('recommend-td');
        Array.from($recommendTds).forEach(($td) => {
          $td.parentNode.addEventListener('click', () => this.rowOnClick($td.firstChild.value))
        });
      }
    },

    created() {
      this.$store.dispatch('initPurchasing');
      this.setData();
    },

    mounted() {
      this.addRowEvent();
    },

    beforeDestroy() {
      let $recommendTd = document.getElementsByClassName('recommend-td');
      Array.from($recommendTd).forEach(($td) => {
        $td.parentNode.removeEventListener('click', () => this.rowOnClick($td.firstChild.value))
      });
    },

    data () {
      return {
        breadcrumbs: [
          { text: 'Recommendations' }
        ],

        searchContent: '',
        tableItems: [],
        rowsPerPageItems: [10, 15, 25, { text: "All", value: -1 }],
        headers: [{
          text: 'Recommendation #',
          left: true,
          value: 'number',
        }, {
          text: 'Type',
          value: 'type',
          left: true
        }, {
          text: 'productType',
          value: 'productType',
          left: true
        }, {
          text: 'Quantity',
          value: 'quantity',
          left: true
        }, {
          text: 'Importance',
          value: 'importance',
          left: true
        }, {
          text: 'Is Handled',
          value: 'isHandled',
          left: true
        }]
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