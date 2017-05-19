<template>
  <v-container fluid>
    <v-row>
      <v-col xs6>
        <h6 class="item-header">Not Yet Checked Items</h6>
      </v-col>
      <v-col xs6 class="text-xl-right">
        <v-row>
          <v-col xs1 offset-xs3>
            <v-checkbox
                hide-details
                primary
                disabled
                v-model="autoAllocation"
                pt-1
            >
            </v-checkbox>
          </v-col>
          <v-col xs4 class="text-xs-left" pt-4 pl-0>
            <p class="checkbox-text"><b>Auto store allocation</b></p>
          </v-col>
          <v-col xs4>
            <v-btn light success outline class="mt-4"
                   :disabled="!canCheck"
                   @click.native="checkSelected"
            >
              Check Selected
            </v-btn>
          </v-col>
        </v-row>
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
              v-on:keyup.native="onCheckQuantityChange"
              class="to-do-input"
              type="number"
              :name="item.id.toString()"
              v-model="item.toCheck"
              min="0"
              max="item.quantity"
          ></v-text-field>
        </td>
        <td>{{ item.costPrice }}</td>
        <td>{{ calculateTotalCost(item.toCheck, item.costPrice) }}</td>
      </tr>

      <tr v-if="items.length === 0"><td colspan="100%" class="text-xs-center">All checked</td></tr>
      </tbody>
    </table>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { calculateCost, calculateStockAft } from '../../../utils/utils'
  import Loader from '../../components/loader.vue'

  export default {
    name: 'toCheckItems',

    props: ['toCheckItems', 'order'],

    components: {
      Loader
    },

    watch: {
      toCheckItems() {
        this.setData();
      }
    },

    computed: {
      ...mapGetters ([
        'getVariantById',
        'variants'
      ]),
    },

    methods: {
      ...mapActions([
        'checkPurchaseOrder',
        'toggleLoader'
      ]),

      calculateTotalCost: function (quantity, unitCost) {
        return calculateCost(quantity, unitCost);
      },

      onCheckQuantityChange: function (e) {
        let toCheck = e.target.value;
        let id = parseInt(e.target.name);

        if (toCheck === "0" || !toCheck) {
          this.items.find(item => item.id === id).value = false;
        } else if (toCheck) {
          this.items.find(item => item.id === id).value = true;
        }

        this.canCheck = false;
        Array.from(this.items).forEach(item => {
          if (item.value) {
            this.canCheck = true;
          }
        })
      },

      checkSelected () {
        // update purchase order
        this.checkPurchaseOrder({
          order: this.order,
          items: this.items
        });

        this.items = this.items.map(item => {
          item = Object.assign({}, item);
          if (item.value) {
            let toCheck = parseInt(item.toCheck);
            item.quantity -= toCheck;
            item.checkedQuantity += toCheck;
            item.toCheck = item.quantity;
          }
          item.value = true;
          return item;
        });

        this.items = this.items.filter(item => item.quantity > 0);

        if (this.items.length === 0) {
          this.canCheck = false;
        }

        // reload data
        this.$emit('checkPurchase');
      },

      setData() {
        this.items = [];
        Array.from(this.toCheckItems).forEach(item => {
          Object.keys(this.item).forEach(key => {
            if (item.hasOwnProperty(key)) {
              this.item[key] = item[key]
            }
          });
          this.items.push(Object.assign({}, this.item))
        });
      }
    },

    mounted() {
      this.setData();
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
          toCheck: 0,
          checkedQuantity: 0,
          available: 0,
          costPrice: 0,
          popularity: 0,
          image: '',
          value: false
        },
        canCheck: true,
        allChecked: false,
        autoAllocation: true,

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
          text: 'To Check',
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

  .to-do-input {
    margin: 1rem 0 0 0;
  }

  .checkbox-text {
    line-height: 25px;
    padding-left: 0;
    padding-right: 0;
  }
</style>