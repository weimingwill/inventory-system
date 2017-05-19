<template>
  <v-container fluid>

    <v-row>
      <v-col xs6>
        <h6 class="item-header">Not Yet Received Items</h6>
      </v-col>
      <v-col xs6 class="text-xl-right">
        <v-btn light success outline class="mt-4"
               :disabled="!canReceive"
               @click.native="receiveSelected"
        >
          Receive Selected
        </v-btn>
      </v-col>
    </v-row>

    <table class="datatable table">
      <thead>
      <tr>
        <th v-for="header in headers">
          {{ header.text }}
        </th>
      </tr>
      </thead>

      <tbody ref="itemTbody">
      <tr v-for="(item, index) in items" :key="item.id">
        <td>
          <v-checkbox
              hide-details
              primary
              v-model="item.value"
          ></v-checkbox>
        </td>
        <td class="image-td">
          <img class="product-image" :src="item.image">
        </td>
        <td>{{ item.fullname }} </td>
        <td>{{ item.quantity }} </td>
        <td>
          <v-text-field
              v-on:keyup.native="onReceiveQuantityChange"
              class="to-receive-input"
              type="number"
              :name="item.id.toString()"
              v-model="item.toReceive"
              min="0"
              max="item.quantity"
          ></v-text-field>
        </td>
        <td>{{ calculateStockAftReceive(item.toReceive, item.available, item.receivedQuantity) }}</td>
        <td>{{ item.costPrice }}</td>
        <td>{{ calculateTotalCost(item.toReceive, item.costPrice) }}</td>
      </tr>

      <tr v-if="allReceived"><td colspan="100%" class="text-xs-center">All received</td></tr>
      </tbody>
    </table>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { calculateCost, calculateStockAft } from '../../../utils/utils'

  export default {
    name: 'ToReceiveItems',

    props: ['toReceiveItems', 'order'],

    computed: {
      ...mapGetters ([
        'getVariantById',
        'variants'
      ]),
    },

    methods: {
      ...mapActions([
        'receivePurchaseOrder'
      ]),

      calculateTotalCost: function (quantity, unitCost) {
        return calculateCost(quantity, unitCost);
      },

      calculateStockAftReceive: function (quantity, available, receivedQuantity=0) {
        return calculateStockAft(quantity, available, receivedQuantity);
      },

      onReceiveQuantityChange: function (e) {
        let toReceive = e.target.value;
        let id = parseInt(e.target.name);

        if (toReceive === "0" || !toReceive) {
          this.items.find(item => item.id === id).value = false;
        } else if (toReceive) {
          this.items.find(item => item.id === id).value = true;
        }

        this.canReceive = false;
        Array.from(this.items).forEach(item => {
          if (item.value) {
            this.canReceive = true;
          }
        })
      },

      receiveSelected () {
        // update purchase order
        this.receivePurchaseOrder({
          order: this.order,
          items: this.items
        });

        this.items = this.items.map(item => {
          item = Object.assign({}, item);
          if (item.value) {
            let toReceive = parseInt(item.toReceive);
            item.quantity -= toReceive;
            item.receivedQuantity += toReceive;
            item.toReceive = item.quantity;
          }
          item.value = true;
          return item;
        });


        this.items = this.items.filter(item => item.quantity > 0);

        if (this.items.length === 0) {
          this.canReceive = false;
          this.allReceived = true;
        }

        // reload data
        this.$emit('receivePurchase');
      }
    },

    mounted() {
      Array.from(this.toReceiveItems).forEach(item => {
        Object.keys(this.item).forEach(key => {
          if (item.hasOwnProperty(key)) {
            this.item[key] = item[key]
          }
        });
        this.items.push(Object.assign({}, this.item))
      });

      if (this.items.length === 0) {
        this.allReceived = true;
      }
    },

    beforeDestroy() {
    },

    data() {
      return {
        items: [],
        item: {
          id: 0,
          fullname: '',
          quantity: 0,
          toReceive: 0,
          receivedQuantity: 0,
          available: 0,
          costPrice: 0,
          image: '',
          value: false
        },
        canReceive: true,
        allReceived: false,

        headers: [{
          text: '',
          left: true,
          sortable: false
        }, {
          text: '',
          left: true,
          sortable: false
        }, {
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
          text: 'Unit Cost',
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