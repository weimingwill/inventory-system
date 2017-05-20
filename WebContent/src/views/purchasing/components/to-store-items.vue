<template>
  <v-container fluid>

    <v-row>
      <v-col xs6>
        <h6 class="item-header">Not Yet Stored Items</h6>
      </v-col>
      <v-col xs6 class="text-xl-right">
        <v-row>
          <v-col xs4 offset-xs5>
            <warehouse-map-dialog
              :variants="items"
              :order="order"
              v-on:itemsAllocated="itemsAllocated"
            >
            </warehouse-map-dialog>
          </v-col>
          <v-col xs2>
            <v-btn light success outline class="mt-4"
                   :disabled="!canStore"
                   @click.native="storeSelected"
            >
              Store Selected
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
              v-on:keyup.native="onStoreQuantityChange"
              class="to-do-input"
              type="number"
              :name="item.id.toString()"
              v-model="item.toStore"
              min="0"
              max="item.quantity"
          ></v-text-field>
        </td>
        <td>{{ item.toAllocate }}</td>
        <td>{{ item.costPrice }}</td>
        <td>{{ calculateTotalCost(item.toStore, item.costPrice) }}</td>
        <td class="location-td">{{ item.location }}</td>
      </tr>

      <tr v-if="items.length === 0"><td colspan="100%" class="text-xs-center">All stored</td></tr>
      </tbody>
    </table>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { calculateCost, calculateStockAft } from '../../../utils/utils'
  import WarehouseMapDialog from './warehouse-map-dialog.vue'

  export default {
    name: 'ToStoreItems',

    props: ['toStoreItems', 'order'],

    components: {
      WarehouseMapDialog
    },

    watch: {
      toStoreItems() {
        this.setData();
      }
    },

    computed: {
      ...mapGetters ([
        'getVariantById',
        'variants',
        'getVariantAllocations',
        'getVariantAllocationsShelves',
        'getCellVariantByVariantIdAndOrderId'
      ]),
    },

    methods: {
      ...mapActions([
        'storePurchaseOrder'
      ]),

      calculateTotalCost: function (quantity, unitCost) {
        return calculateCost(quantity, unitCost);
      },

      onStoreQuantityChange: function (e) {
        let toStore = e.target.value;
        let id = parseInt(e.target.name);

        if (toStore === "0" || !toStore) {
          this.items.find(item => item.id === id).value = false;
        } else if (toStore) {
          this.items.find(item => item.id === id).value = true;
        }

        this.canStore = false;
        Array.from(this.items).forEach(item => {
          if (item.value) {
            this.canStore = true;
          }
        })
      },

      storeSelected () {
        // update purchase order
        this.storePurchaseOrder({
          order: this.order,
          items: this.items
        });

        this.items = this.items.map(item => {
          item = Object.assign({}, item);
          if (item.value) {
            let toStore = parseInt(item.toStore);
            item.quantity -= toStore;
            item.storedQuantity += toStore;
            item.toStore = item.quantity;
          }
          item.value = true;
          return item;
        });

        this.items = this.items.filter(item => item.quantity > 0);

        if (this.items.length === 0) {
          this.canStore = false;
        }

        // reload data
        this.$emit('storePurchase');
      },

      setData() {
        this.items = [];
        Array.from(this.toStoreItems).forEach(item => {
          Object.keys(this.item).forEach(key => {
            if (item.hasOwnProperty(key)) {
              this.item[key] = item[key]
            }
          });
          this.item.location = this.getVariantAllocationsShelves(this.item.id, this.order.id);
          let cellVariants = this.getCellVariantByVariantIdAndOrderId(this.item.id, this.order.id);
          this.item.allocations = this.getVariantAllocations(cellVariants);
          this.items.push(Object.assign({}, this.item))
        });
      },

      itemsAllocated () {
        this.$emit('storePurchase');
      },
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
          toStore: 0,
          storedQuantity: 0,
          toAllocate: 0,
          available: 0,
          costPrice: 0,
          image: '',
          location: '',
          allocations: [],
          value: false
        },
        canStore: true,
        allStored: false,

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
          text: 'To Store',
          left: true,
          sortable: false
        },{
          text: 'To Allocate Location',
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
        }, {
          text: 'Shelves',
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