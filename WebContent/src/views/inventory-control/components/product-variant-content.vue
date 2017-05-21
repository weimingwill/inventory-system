<template>
    <v-data-table
        v-bind:headers="headers"
        v-model="items"
        v-bind:search="searchContent"
        select-all
        hide-actions
    >
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
        <td>{{ props.item.sku }}</td>
        <td>{{ props.item.color }}</td>
        <td>{{ props.item.size }}</td>
        <td>{{ props.item.costPrice }}</td>
        <td>{{ props.item.sellPrice }}</td>
        <td>{{ props.item.incoming }}</td>
        <td>{{ props.item.onHand }}</td>
        <td>{{ props.item.available }}</td>
        <td>{{ props.item.committed }}</td>
        <td>{{ props.item.popularity }}</td>
        <td><v-icon>place</v-icon></td>
      </template>
    </v-data-table>
</template>

<script>

  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: ['searchContent', 'productId'],

    computed: {
      items () {
        return this.$store.getters.getProductVariants(this.productId);
      },
    },

    methods: {
      ...mapActions([
        'getProductVariants'
      ])
    },

    created() {
      if (this.items.length === 0) {
        this.$store.dispatch('initWarehouse');
        this.$store.dispatch('initSupplier');
        this.$store.dispatch('initInventory');
      }
    },

    data () {
      return {
        headers: [{
          text: '',
          left: true,
          sortable: false,
          value: '',
        }, {
          text: 'Sku',
          value: 'sku',
          left: true
        }, {
          text: 'Color',
          value: 'color',
          left: true
        }, {
          text: 'Size',
          value: 'size',
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
  .product-image {
    width: 40px;
    height: auto;
  }

  .image-td {
    padding-top: 6px!important;
  }
</style>
