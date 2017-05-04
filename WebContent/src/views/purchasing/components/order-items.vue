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
        <tr ref="newItemRow" v-for="(item, index) in items">
          <td class="image-td">
            <img class="product-image" :src="item.image">
          </td>
          <td>{{ item.fullname }} </td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.stockAftPurchase }}</td>
          <td>{{ item.cost }}</td>
          <td>{{ item.tax }}</td>
          <td>{{ item.total }}</td>
        </tr>

        <tr>
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
          <td>{{ newItem.stockAftPurchase }}</td>
          <td>{{ newItem.cost }}</td>
          <td>{{ newItem.tax }}</td>
          <td>{{ newItem.total }}</td>
        </tr>
      </tbody>
    </table>
    <v-btn @click.native="addItem" default light class="add-item-btn" :disabled="hasNewItem">
      <v-icon>add</v-icon>Add another item
    </v-btn>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'OrderItems',

    computed: {
      ...mapGetters ([
        'getVariantById',
        'variants'
      ]),
    },

    watch: {
      isKeyup: function () {

      }
    },

    methods: {
      addItem: function () {
        this.items.push({
          image: '',
          name: '',
          quantity: '',
          stockAftPurchase: '',
          cost: '',
          tax: '7%',
          total: ''
        });
      },

      searchVariants: function () {
        // Todo: onkeyup has problem when deleting input
        this.isKeyup = true;

        this.filteredVariants = this.variants.filter(v => v.fullname.includes(this.newItem.searchContent)).slice(0,5);

        // Todo: add event listener only once
        Array.from(document.getElementsByClassName('list-item')).forEach(($list) => {
          let $input = $list.firstChild;
          if ($input.name === "0") {
            $list.addEventListener('click', () => this.setItem(parseInt($input.value)));
            $input.name = "1";
          }
        });
      },

      setItem: function (variantId) {
        this.isKeyup = false;
        let index = 0;
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].name) {
            index = i - 1;
            break;
          }
        }

        let variant = this.getVariantById(variantId);
        this.newItem.image = variant.image;
        this.newItem.fullname = variant.fullname;
        this.newItem.cost = variant.costPrice;
        this.items.splice(index, 0, this.newItem);
        this.hasNewItem = true;
      }

    },

//    created() {
//      this.$store.dispatch('initWarehouse');
//      this.$store.dispatch('initSupplier');
//      this.$store.dispatch('initInventory');
//      this.$store.dispatch('initPurchasing');
//    },

    mounted() {
//      console.log(document.getElementsByClassName('list-item'))
//      Array.from(document.getElementsByClassName('list-item')).forEach(($list) => {
//        $list.addEventListener('click', () => this.setItem($list.firstChild.value))
//      });
//      Array.from(document.getElementsByClassName('list-item')).forEach(($list) => {
//        $list.addEventListener('click', () => this.setItem($list.firstChild.value))
//      });
//      this.isKeyup = false;
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
        }, {
          text: 'Tax',
        }, {
          text: 'Total',
        }],

        isKeyup: true,
        hasNewItem: false,
        filteredVariants: [],
        newItem: {
          fullname: '',
          quantity: '',
          stockAftPurchase: '',
          cost: '',
          tax: '7%',
          total: '',
          searchContent: ''
        },
        items: [{
          name: '',
          quantity: '',
          stockAftPurchase: '',
          cost: '',
          tax: '7%',
          total: ''
        }]
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
</style>