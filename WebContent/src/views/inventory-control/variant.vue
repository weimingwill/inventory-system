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
        <variant-content :search-content="searchContent"></variant-content>
    </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import VariantContent from '../inventory-control/components/variant-content.vue'

  export default {

    name: 'inventory',

    components: {
      Breadcrumbs,
      VariantContent
    },

    data () {
      return {
        breadcrumbs: [
          { text: 'Variants' }
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