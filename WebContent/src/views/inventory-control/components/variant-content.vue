<template>
  <v-tabs>
    <v-tab-item
        v-for="i in 1" :key="i"
        v-bind:href="'#mobile-tabs-3-' + i"
        slot="activators"
    >
      All
    </v-tab-item>
    <v-tab-content
        v-for="i in 1" :key="i"
        v-bind:id="'mobile-tabs-3-' + i"
        slot="content"
    >
      <v-card>
        <v-data-table
            v-bind:headers="headers"
            v-model="items"
            v-bind:search="searchContent"
            select-all
        >
          <p> {{ items }}</p>

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
            <td class="">{{ props.item.sku }}</td>
            <td class="">{{ props.item.name }}</td>
            <td class="">{{ props.item.costPrice }}</td>
            <td class="">{{ props.item.sellPrice }}</td>
            <td class="">{{ props.item.incoming }}</td>
            <td class="">{{ props.item.onHand }}</td>
            <td class="">{{ props.item.available }}</td>
            <td class="">{{ props.item.committed }}</td>
            <td class="">{{ props.item.size }}</td>
            <td class="">{{ props.item.color }}</td>
            <td class="">{{ props.item.popularity }}</td>
            <td class=""><v-icon>place</v-icon></td>
          </template>
        </v-data-table>
      </v-card>
    </v-tab-content>
  </v-tabs>
</template>

<script>

  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: ['searchContent'],

    computed: {
      ...mapGetters({
        items: 'variants',
        getSupplierName: 'getSupplierNameById',
        getBrand: 'getBrandById'
      })
    },

    methods: {

    },

    created() {
      if (this.items.length === 0) {
        this.$store.dispatch('initInventory')
      }
    },

    data () {
      return {
        headers: [{
          text: '',
          left: true,
          sortable: false,
          value: 'name',
        }, {
          text: 'Sku',
          value: 'sku',
          left: true
        }, {
          text: 'Name',
          value: 'name',
          left: true
        }, {
          text: 'Cost Price',
          value: 'costPrice',
          left: true
        }, {
          text: 'Sell Price',
          value: 'sellPrice',
          left: true
        }, {
          text: 'Incoming',
          value: 'incoming',
          left: true
        }, {
          text: 'On Hand',
          value: 'onHand',
          left: true
        }, {
          text: 'Available',
          value: 'available',
          left: true
        }, {
          text: 'Committed',
          value: 'committed',
          left: true
        }, {
          text: 'Size',
          value: 'size',
          left: true
        }, {
          text: 'Color',
          value: 'color',
          left: true
        }, {
          text: 'Popularity',
          value: 'popularity',
          left: true
        }, {
          text: 'Map',
          value: 'map',
          left: true
        }],
        e3: ''
      }
    }
  }
</script>

<style scoped>
  .tabs__items {
    border-bottom-width: 0px;
  }

  .datatable {
    margin-bottom: 200px;
  }

  .rotate-180 {
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
  }

  .tools {
    margin-top: -10px;
  }

  .product-image {
    width: 40px;
    height: auto;
  }

  .image-td {
    padding-top: 6px!important;
  }
</style>
