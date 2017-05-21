<template>
  <div>
    <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="searchVariantTable"
    ></v-text-field>
    <v-data-table
        class="variant-table"
        v-bind:search="searchVariantTable"
        v-bind:headers="headers"
        v-model="cellVariantJoins"
        rows-per-page="9"
        :rows-per-page-items="rowsPerPageItems"
    >
      <template slot="items" scope="props">
        <td class="image-td">
          <img class="product-image" :src="props.item.image">
        </td>
        <td>{{ props.item.fullname }}</td>
        <td>{{ props.item.quantity }}</td>
        <td>{{ props.item.location }}</td>
        <!--<td>{{ props.item.layerName }}</td>-->
        <!--<td>{{ props.item.cellName }}</td>-->
      </template>
    </v-data-table>
  </div>

</template>

<script>
  import { ALLOCATION_HEADERS } from '../../../utils/setting'

  export default {
    name: 'WarehouseAllocationTable',

    props: ['items'],

    computed: {
      cellVariantJoins () {
        return this.items;
      }
    },

    data () {
      return {
        searchVariantTable: '',
        headers: ALLOCATION_HEADERS,
        rowsPerPageItems: [5, 9],
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
    padding: 0 0 0 0 !important;
  }

</style>

<style>
  .variant-table table tbody tr td {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  .variant-table table thead th {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
</style>