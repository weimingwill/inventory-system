<template>
  <v-container fluid>
    <h6 class="item-header">All Ordered Items</h6>

    <table class="datatable table">
      <thead>
      <tr>
        <th v-for="header in headers">
          {{ header.text }}
        </th>
      </tr>
      </thead>

      <tbody ref="itemTbody">
      <tr v-for="(item, index) in orderedItems">
        <td class="image-td">
          <img class="product-image" :src="item.image">
        </td>
        <td>{{ item.fullname }} </td>
        <td>
          <v-text-field
              v-if="!isView"
              type="number"
              name="quantity"
              v-model="item.quantity"
          ></v-text-field>
          <span v-else>{{ item.quantity }}</span>
        </td>
        <td>{{ calculateStockAftPurchase(item.quantity, item.available) }}</td>
        <td>{{ item.costPrice }}</td>
        <!--<td>{{ item.tax }}</td>-->
        <td>{{ calculateTotalCost(item.quantity, item.costPrice) }}</td>
        <td class="delete-td" v-if="!isView">
          <v-btn icon="icon" class="black--text" @click.native="deleteItem(item.id)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </tr>

      <tr ref="newItemRow" v-show="hasNewItem">
        <td class="image-td">
        </td>
        <td>
          <variant-list
              :searchContent="newItem.searchContent"
              :items="orderedItems"
              :variants="filteredVariants"
              v-on:itemClicked="setItem"
          ></variant-list>
        </td>
        <td>
          <v-text-field
              type="number"
              name="quantity"
              v-model="newItem.quantity"
          ></v-text-field>
        </td>
        <td>{{ newItem.available }}</td>
        <td>{{ newItem.costPrice }}</td>
        <!--<td>{{ newItem.tax }}</td>-->
        <td>{{ newItem.total }}</td>
        <td class="delete-td">
          <v-btn icon="icon" class="black--text" @click.native="deleteNewItem">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </tr>

      </tbody>
    </table>
    <v-btn v-if="!isView" @click.native="addNewItem" default light class="add-item-btn" :disabled="hasNewItem">
      <v-icon>add</v-icon>Add another item
    </v-btn>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { calculateCost, calculateStockAft } from '../../../utils/utils'
  import VariantList from '../components/variant-list.vue'
  import * as s from '../../../utils/setting'

  export default {
    name: 'OrderItems',

    props: ['orderedItems', 'isView', 'order'],

    components: {
      VariantList
    },

    watch: {
      'order.supplier' () {
        let supplier = this.getSupplierByName(this.order.supplier);
        let products = this.getObjectListByAttr(s.MODULE_INVENTORY, s.OBJ_PRODUCTS, 'supplierId', supplier.id);
        this.filteredVariants = [];
        Array.from(products).forEach(product => {
          let variants = this.getObjectListByAttr(s.MODULE_INVENTORY, s.OBJ_VARIANTS, 'productId', product.id);
          this.filteredVariants = this.filteredVariants.concat(variants);
        });
      }
    },

    computed: {
      ...mapGetters ([
        'getVariantById',
        'variants',
        'getObjectListByAttr',
        'getSupplierByName'
      ])
    },

    methods: {
      addNewItem: function () {
        this.hasNewItem = true;
      },

      deleteNewItem: function () {
        this.hasNewItem = false;
      },

      deleteItem: function (id) {
        this.orderedItems = this.orderedItems.filter(item => item.id !== id);
      },

      setItem: function (variantId) {
        this.isKeyup = false;
        let index = 0;
        for (let i = 0; i < this.orderedItems.length; i++) {
          if (this.orderedItems[i].name) {
            index = i - 1;
            break;
          }
        }

        let variant = this.getVariantById(variantId);
        this.newItem.id = variantId;
        this.newItem.image = variant.image;
        this.newItem.fullname = variant.fullname;
        this.newItem.costPrice = variant.costPrice;
        this.newItem.quantity = 1;
        this.newItem.available = variant.available;
        this.newItem.searchContent = '';
        this.orderedItems.push(Object.assign({}, this.newItem));
//        this.orderedItems.splice(index, 0, Object.assign({}, this.newItem));
        this.hasNewItem = false;
      },

      calculateTotalCost: function (quantity, unitCost) {
        return calculateCost(quantity, unitCost);
      },

      calculateStockAftPurchase: function (quantity, available) {
        return calculateStockAft(quantity, available)
      }
    },

    data() {
      return {
        headers: [{
          text: '',
        },{
          text: 'Item Name',
        }, {
          text: 'Quantity',
        }, {
          text: 'Stock After Purchase',
        }, {
          text: 'Unit Cost',
        },
//          {
//          text: 'Tax',
//        },
          {
            text: 'Total Cost($)',
          }],

        isKeyup: true,
        hasNewItem: false,
        filteredVariants: this.variants,
        newItem: {
          id: 0,
          fullname: '',
          quantity: '',
          available: 0,
          costPrice: '',
          tax: '7%',
          total: '',
          searchContent: ''
        }
      }
    }
  }
</script>

<style scoped>
  .add-item-btn {
    width: 100%;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .item-list {
    position: absolute;
    z-index: 2;
    margin: -40px 0 0 -1px;
    padding: 0;
  }

  .product-image {
    width: 40px;
    height: auto;
  }

  .image-td {
    padding-top: 6px!important;
  }

  .delete-td {
    padding-left: 0;
    padding-right: 0;
  }

  .item-header {
    margin: 30px 0 0 30px;
  }
</style>