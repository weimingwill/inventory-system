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
          ></v-text-field>
        </td>
        <td>{{ calculateStockAftReceive(item.toReceive, item.available) }}</td>
        <td>{{ item.costPrice }}</td>
        <td>{{ calculateCost(item.toReceive, item.costPrice) }}</td>
      </tr>
      </tbody>
    </table>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'ToReceiveItems',

    props: ['toReceiveItems'],

    computed: {
      ...mapGetters ([
        'getVariantById',
        'variants'
      ]),
    },

    methods: {
      calculateCost: function (quantity, unitCost) {
        if (quantity === '') {
          return 0;
        } else {
          return parseInt(quantity) * unitCost;
        }
      },

      calculateStockAftReceive: function (quantity, available) {
        if (quantity === '') {
          return 0
        } else {
          return parseInt(quantity) + available;
        }
      },

      onReceiveQuantityChange: function (e) {
        let toReceive = e.target.value;
        let id = parseInt(e.target.name);
        console.log(toReceive);

        if (toReceive === "0" || !toReceive) {
          this.items.find(item => item.id === id).value = false;
        } else if (toReceive) {
          this.items.find(item => item.id === id).value = true;
        }
      }
    },

    mounted() {
      Array.from(this.toReceiveItems).forEach(item => {
        Object.keys(this.item).forEach(key => {
          this.item[key] = item[key]
        });
        this.items.push(Object.assign({}, this.item))
      });
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
          available: 0,
          costPrice: 0,
          image: '',
          value: false
        },
//        toReceiveItems: [],
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