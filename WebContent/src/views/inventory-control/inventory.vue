<template>
    <div>
        <breadcrumbs :items="items"></breadcrumbs>
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
                <v-btn success dark>
                    <v-icon left>add</v-icon>
                    New Product
                </v-btn>

                <v-btn default light>
                    <v-icon left>system_update_alt</v-icon>
                    Import
                </v-btn>

                <v-btn default light>
                    <v-icon left class="rotate-180">system_update_alt</v-icon>
                    Export
                </v-btn>
            </v-card-title>
        </div>
        <header></header>
        <inventory-content :search-content="searchContent"></inventory-content>
    </div>


</template>

<script>
  import Breadcrumbs from '../breadcrumbs.vue'
  import InventoryContent from '../inventory-control/components/inventory-content.vue'

  export default {

    name: 'inventory',

    components: {
      Breadcrumbs,
      InventoryContent
    },

    data () {
      return {
        headers: [
          {
            text: 'Dessert (100g serving)',
            left: true,
            sortable: false,
            value: 'name'
          },
          { text: 'Calories', value: 'calories' }
        ],
        items: [
          {
            text: 'Dashboard',
            value: false,
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            sodium: 87,
            calcium: '14%',
            iron: '1%'
          },
          {
            text: 'link1',
            value: false,
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            sodium: 129,
            calcium: '8%',
            iron: '1%'
          }
        ],
        searchContent: '',
        items3: ''
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