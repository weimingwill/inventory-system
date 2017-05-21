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
    <v-row>
      <v-col xs10>
        <product-variant-content :productId="id" :search-content="searchContent"></product-variant-content>
      </v-col>
      <v-col xs2>
        <product-details :productId="id"></product-details>
      </v-col>
    </v-row>
  </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import ProductVariantContent from '../inventory-control/components/product-variant-content.vue'
  import ProductDetails from '../inventory-control/components/product-details.vue'

  export default {

    name: 'inventory',

    components: {
      Breadcrumbs,
      ProductVariantContent,
      ProductDetails
    },

    computed: {
      productUrl () {
        let url = window.location.href.split('/');
        url.pop();
        console.log('url', url.join('/'))
        return url.join('/');
      }
    },

    data () {
      return {
        breadcrumbs: [
          {
            text: 'products',
            target: '_self'
          },
          { text: 'Variants'}
        ],
        searchContent: '',
        id: parseInt(this.$route.params.id)
      }
    },

    mounted () {
      this.breadcrumbs[0].href = this.productUrl;
    }

  }
</script>

<style>
  .tool-card {
    margin: -100px 0 -1px 0;
    right: 0;
  }
</style>