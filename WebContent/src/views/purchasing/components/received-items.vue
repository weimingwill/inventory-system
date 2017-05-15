<template>
  <v-container fluid>
    <v-divider class="items-divider"></v-divider>

    <h6 class="item-header">Received Items</h6>

    <v-expansion-panel class="item-panel" expand>
      <v-expansion-panel-content v-for="(item, i) in receivedItems" :key="i">
        <div slot="header">Received At {{ item.datetime }}</div>

        <table class="datatable table">
          <thead>
          <tr>
            <th v-for="header in headers">
              {{ header.text }}
            </th>
          </tr>
          </thead>

          <tbody ref="itemTbody">
          <tr v-for="(variant, index) in item.variants" v-if="variant.quantity > 0">
            <td class="image-td">
              <img class="product-image" :src="variant.image">
            </td>
            <td>{{ variant.fullname }}</td>
            <td>{{ variant.quantity }}</td>
            <td>{{ variant.costPrice }}</td>
            <td>{{ calculateTotalCost(variant.quantity, variant.costPrice) }}</td>
            <!--<td class="delete-td">-->
              <!--<v-btn icon="icon" class="black&#45;&#45;text" @click.native="deleteItem(variant.id)">-->
                <!--<v-icon>delete</v-icon>-->
              <!--</v-btn>-->
            <!--</td>-->
          </tr>
          </tbody>
        </table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { calculateCost } from '../../../utils/utils'

  export default {
    name: 'ReceivedItems',

    props: ['receivedItems'],

    computed: {
      ...mapGetters ([
        'getVariantById',
        'variants',
      ]),
    },

    methods: {
      // Todo: refactor this function
      calculateTotalCost: function (quantity, unitCost) {
        return calculateCost(quantity, unitCost);
      },
    },

    deleteItem: function (id) {
      // Todo: check variant.id or variant.variantId
      this.receivedItems.variants = this.orderedItems.variants.filter(variant => variant.id !== id);
    },

    beforeDestroy() {
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
          text: 'Unit Cost',
        }, {
          text: 'Total Cost($)',
        }]
      }
    }
  }
</script>

<style scoped>
  .item-panel {
    margin: 30px 0 0 20px;
    width: 98%
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
    margin: 30px 0 20px 30px;
  }

  .items-divider {
    margin: 30px 0 0 0;
  }

</style>