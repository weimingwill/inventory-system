<template>
  <v-container fluid>

    <v-row>
      <v-col xs6>
        <h6 class="item-header">Not Yet Received Items</h6>
      </v-col>
      <v-col xs6 class="text-xl-right">
        <v-btn light success outline class="mt-4">Receive Selected</v-btn>
        <!--<v-btn>Receive All</v-btn>-->
      </v-col>
    </v-row>


    <v-data-table
        v-bind:headers="headers"
        v-model="items"
        hide-actions
        select-all
    >
      <template slot="items" scope="props">
        <td>
          <v-checkbox
              hide-details
              primary
              v-model="props.item.value"
          ></v-checkbox>
        </td>
        <td class="image-td">
          <img class="product-image" :src="props.item.image">
        </td>
        <td>{{ props.item.fullname }} </td>
        <td>{{ props.item.quantity }} </td>
        <td>
          <v-text-field
              v-on:keyup.native="onReceiveQuantityChange"
              class="to-receive-input"
              type="number"
              name="to-receive"
              v-model="props.item.toReceive"
          ></v-text-field>
        </td>
        <td>{{ calculateStockAftPurchase(props.item.toReceive, props.item.available) }}</td>
        <td>{{ props.item.costPrice }}</td>
        <td>{{ calculateCost(props.item.toReceive, props.item.costPrice) }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'ToReceiveItems',

    props: ['toReceiveItems', 'isView'],

    computed: {
      ...mapGetters ([
        'getVariantById',
        'variants'
      ]),
    },

    watch: {
      test () {
        console.log(this.test);
      },

      items () {
        console.log(this.items)
      }
    },

    methods: {
      calculateCost: function (quantity, unitCost) {
        if (quantity === '') {
          return 0;
        } else {
          return parseInt(quantity) * unitCost;
        }
      },

      calculateStockAftPurchase: function (quantity, available) {
        if (quantity === '') {
          return 0
        } else {
          return parseInt(quantity) + available;
        }
      },
  
      onReceiveQuantityChange: function (e) {
      }
    },

    mounted() {
      this.items = this.toReceiveItems.slice();



    },

    beforeDestroy() {
    },

    data() {
      return {
        test: '',
        items: [],
//        toReceiveItems: [],
        headers: [{
          text: '',
          left: true,
          sortable: false
        },{
          text: 'Item Name',
          left: true,
          sortable: false
        }, {
          text: 'Quantity',
          left: true,
          sortable: false
        }, {
          text: 'To Receive',
          left: true,
          sortable: false
        }, {
          text: 'Stock After Receive',
          left: true,
          sortable: false
        }, {
          text: 'Item Unit Cost',
          left: true,
          sortable: false
        }, {
          text: 'Total Cost($)',
          left: true,
          sortable: false
        }],
      }
    }
  }
</script>

<style scoped>
  .product-image {
    width: 40px;
    height: auto;
  }

  .image-td {
    padding-top: 6px!important;
  }

  .item-header {
    margin: 30px 0 0 30px;
  }

  .to-receive-input {
    margin: 1rem 0 0 0;
  }
</style>