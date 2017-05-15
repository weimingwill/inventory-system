<template>
  <v-container fluid>
    <v-divider class="items-divider"></v-divider>

    <h6 class="item-header">Adjusted Items</h6>

    <v-expansion-panel class="item-panel" expand>
      <v-expansion-panel-content v-for="(item, i) in adjustedItems" :key="i">
        <div slot="header">Adjusted At {{ item.date }}</div>

        <v-container>
          <v-row>
            <v-col xs4 pt-4 pb-2>
              Adjusted status: <b> {{ item.status }} </b>
            </v-col>
            <v-col xs4 pt-4 pb-2>
              Adjusted reason: <b> {{ item.reason }} </b>
            </v-col>
            <v-col xs4 pt-4 pb-2 v-if="item.shouldReturn">
              Remark: <b> Return to suppliers </b>
            </v-col>
            <v-col xs4 pt-4 pb-2 v-else>
              Remark: <b> Cost </b>
            </v-col>
          </v-row>
        </v-container>

        <table class="datatable table">
          <thead>
          <tr>
            <th v-for="header in headers">
              {{ header.text }}
            </th>
          </tr>
          </thead>

          <tbody ref="itemTbody">
          <tr v-for="(variant, index) in item.variants" v-if="variant.quantity > 0" :key="index">
            <td class="image-td">
              <img class="product-image" :src="variant.image">
            </td>
            <td>{{ variant.fullname }}</td>
            <td>{{ variant.quantity }}</td>

            <td v-if="item.shouldReturn">0</td>
            <td v-else>{{ variant.costPrice }}</td>

            <td v-if="item.shouldReturn">0</td>
            <td v-else>{{ calculateCost(variant.quantity, variant.costPrice) }}</td>

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

  export default {
    name: 'AdjustedItems',

    props: ['adjustedItems'],

    computed: {
      ...mapGetters ([
        'getVariantById',
        'variants',
      ]),
    },

    methods: {
      // Todo: refactor this function
      calculateCost: function (quantity, unitCost) {
        if (quantity === '') {
          return 0;
        } else {
          return parseInt(quantity) * unitCost;
        }
      },
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