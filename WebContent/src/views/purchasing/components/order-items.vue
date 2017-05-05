<template>
  <v-container fluid>
    <table class="datatable">
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
              type="number"
              name="quantity"
              v-model="item.quantity"
          ></v-text-field></td>
        <td>{{ calculateStockAftPurchase(item.quantity, item.available) }}</td>
        <td>{{ item.costPrice }}</td>
        <!--<td>{{ item.tax }}</td>-->
        <td>{{ calculateCost(item.quantity, item.costPrice) }}</td>
        <td class="delete-td">
          <v-btn icon="icon" class="black--text" @click.native="deleteItem(item.id)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </tr>

      <tr ref="newItemRow" v-show="hasNewItem">
        <td class="image-td">
        </td>
        <td>
          <v-text-field
              v-on:keyup.native="searchVariants"
              name="name"
              v-model="newItem.searchContent"
          ></v-text-field>

          <v-card class="item-list" v-if="isKeyup">
            <v-list>
              <template v-for="variant in filteredVariants">
                <v-list-item
                    v-bind:key="variant.id"
                    ref="listItem"
                    class="list-item"
                >
                  <input type="hidden" v-model="variant.id" name="0">
                  <v-list-tile avatar>
                    <v-list-tile-avatar>
                      <img v-bind:src="variant.image" />
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="variant.fullname" />
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
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
    <v-btn @click.native="addNewItem" default light class="add-item-btn" :disabled="hasNewItem">
      <v-icon>add</v-icon>Add another item
    </v-btn>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'OrderItems',

    props: ['orderedItems'],

    computed: {
      ...mapGetters ([
        'getVariantById',
        'variants'
      ]),
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

      searchVariants: function () {
        // Todo: onkeyup has problem when deleting input
        this.isKeyup = true;

        // Filtered added orderedItems
        this.filteredVariants = this.variants.filter(variant => this.orderedItems.filter(item => item.id === variant.id).length === 0)
        this.filteredVariants = this.filteredVariants.filter(v => v.fullname.includes(this.newItem.searchContent)).slice(0,5);


        Array.from(document.getElementsByClassName('list-item')).forEach(($list) => {
          let $input = $list.firstChild;
          // use name as boolean value to add event listener only once
          if ($input.name === "0") {
            $list.addEventListener('click', () => this.setItem(parseInt($input.value)));
            $input.name = "1";
          }
        });
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
      }
    },

    beforeDestroy() {
      this.$refs.listItem.forEach(($list) => {
        $list.removeEventListener('click', () => this.setItem($list.firstChild.value))
      });
    },

    data() {
      return {
        headers: [{
          text: '',
        },{
          text: 'Item name',
        }, {
          text: 'Quantity',
        }, {
          text: 'Stock after purchase',
        }, {
          text: 'Item unit cost',
        },
//          {
//          text: 'Tax',
//        },
          {
          text: 'Total Cost($)',
        }],

        isKeyup: true,
        hasNewItem: false,
        filteredVariants: [],
        newItem: {
          id: 0,
          fullname: '',
          quantity: '',
          available: 0,
          costPrice: '',
          tax: '7%',
          total: '',
          searchContent: ''
        },
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
</style>