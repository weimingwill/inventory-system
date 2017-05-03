<template>
  <div>
    <breadcrumbs :items="breadcrumbs"></breadcrumbs>
    <v-card>
      <v-row>
        <v-col xs2>
          <v-card-title>Order #P0001</v-card-title>
        </v-col>

        <v-col xs8>
          <v-row row>
            <v-col xs1>
              <v-subheader>Supplier</v-subheader>
            </v-col>
            <v-col xs3>
              <v-select
                  v-bind:items="supplierNames"
                  v-model="order.supplier"
                  label="Select"
                  light
                  v-bind:rules="[() => order.supplier && order.supplier.length > 0 || 'Please select an option']"
              />
            </v-col>

            <v-col xs1 >
              <v-subheader>Email</v-subheader>
            </v-col>
            <v-col xs3>
              <v-select
                  v-bind:items="supplierNames"
                  v-model="order.supplier"
                  label="Select"
                  light
                  v-bind:rules="[() => order.supplier && order.supplier.length > 0 || 'Please select an option']"
              />
            </v-col>
            <v-col xs1>
              <v-subheader>Warehouse</v-subheader>
            </v-col>
            <v-col xs3>
              <v-select
                  v-bind:items="supplierNames"
                  v-model="order.supplier"
                  label="Select"
                  light
                  v-bind:rules="[() => order.supplier && order.supplier.length > 0 || 'Please select an option']"
              />
            </v-col>
          </v-row>

          <!--<v-row>-->
            <!--<v-col xs1>-->
              <!--<v-subheader>Ship To</v-subheader>-->
            <!--</v-col>-->
            <!--<v-col xs4>-->
              <!--<v-select-->
                  <!--v-bind:items="supplierNames"-->
                  <!--v-model="order.supplier"-->
                  <!--label="Select"-->
                  <!--light-->
                  <!--v-bind:rules="[() => order.supplier && order.supplier.length > 0 || 'Please select an option']"-->
              <!--/>-->
            <!--</v-col>-->
          <!--</v-row>-->

        </v-col>

        <v-col xs1 offset-xs1>
          <v-row>
            <v-col xs12><v-btn>Void</v-btn></v-col>
          </v-row>
          <v-row>
          <v-col xs12><v-btn >Edit</v-btn></v-col>
        </v-row>

        </v-col>

      </v-row>
    </v-card>
    <v-row>
      <v-col xs10>
        <!--<product-variant-content :productId="id" :search-content="searchContent"></product-variant-content>-->
      </v-col>
      <v-col xs2>
        <!--<product-details :productId="id"></product-details>-->
      </v-col>
    </v-row>
  </div>


</template>

<script>
  import Breadcrumbs from '../breadcrumbs.vue'
  import ProductVariantContent from '../inventory-control/components/product-variant-content.vue'
  import ProductDetails from '../inventory-control/components/product-details.vue'

  import { mapGetters, mapActions } from 'vuex'

  export default {

    name: 'createPurchaseOrder',

    computed: {
      ...mapGetters([
        'supplierNames'
      ])
    },

    components: {
      Breadcrumbs,
//      ProductVariantContent,
//      ProductDetails
    },

    created() {
//      if (this.items.length === 0) {
      this.$store.dispatch('initWarehouse');
      this.$store.dispatch('initSupplier');
      this.$store.dispatch('initInventory');
      this.$store.dispatch('initPurchasing');
//      }
    },

    data () {
      return {
        breadcrumbs: [
          {
            text: 'purchasing',
            href: window.location.href.replace('createPurchaseOrder', 'purchasing'),
            target: '_self'
          },
          { text: 'Create New Purchase Order'}

        ],
        searchContent: '',
//        id: this.$route.params.id,
        order: {
          supplier: ''
        },
//        supplierNames: [
//          'A',
//          'B'
//        ],
        rules: {
          supplier: [],
        }
      }
    }
  }
</script>

<style>
</style>