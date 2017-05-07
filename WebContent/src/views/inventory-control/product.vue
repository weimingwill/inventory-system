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
                <v-btn outline success dark to="/inventory/createProduct" router>
                    <v-icon left>add</v-icon>
                    New Product
                </v-btn>

                <v-btn outline default light>
                    <v-icon left>system_update_alt</v-icon>
                    Import
                </v-btn>

                <v-btn outline default light>
                    <v-icon left class="rotate-180">system_update_alt</v-icon>
                    Export
                </v-btn>
            </v-card-title>
        </div>
        <header></header>
        <product-content :search-content="searchContent"></product-content>
    </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import ProductContent from './components/product-content.vue'

  export default {

    name: 'product',

    components: {
      Breadcrumbs,
      ProductContent
    },

    data () {
      return {
        breadcrumbs: [
          { text: 'Products' }
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