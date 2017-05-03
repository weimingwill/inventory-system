<template>
  <div>
    <breadcrumbs :items="breadcrumbs"></breadcrumbs>
    <div class="tool-card">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="searchContent"
        ></v-text-field>
        <v-btn outline success dark to="/createVariant" router>
          <v-icon left>add</v-icon>
          New Variant
        </v-btn>
      </v-card-title>
    </div>
    <header></header>
    <product-variant-content :search-content="searchContent"></product-variant-content>
    <!--<product-details></product-details>-->
  </div>


</template>

<script>
  import Breadcrumbs from '../breadcrumbs.vue'
  import productVariantContent from '../inventory-control/components/product-variant-content.vue'

  export default {

    name: 'inventory',

    components: {
      Breadcrumbs,
      productVariantContent
    },

    data () {
      return {
        breadcrumbs: [
          {
            text: 'products',
            href: window.location.href.replace('product-variant', 'product'),
            target: '_self'
          },
          { text: 'Variants'}

        ],
        searchContent: ''
      }
    }
  }
</script>

<style>
  .tool-card {
    margin: -100px 0 -1px 0;
    right: 0;
  }
</style>