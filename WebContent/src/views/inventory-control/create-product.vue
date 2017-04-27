<template>
  <div>
    <breadcrumbs :items="breadcrumbs"></breadcrumbs>
    <v-card class="create-product-form elevation-0">
      <v-card-text>
        <v-card-title class="card-title">
          Product details
        </v-card-title>
        <v-container fluid>
          <v-row row>
            <v-col xs4>
              <v-subheader>Product Name</v-subheader>
            </v-col>
            <v-col xs8>
              <v-text-field
                  name="name"
                  label="Enter product name"
                  v-model="product.name"
                  required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row row>
            <v-col xs4>
              <v-subheader>SKU</v-subheader>
            </v-col>
            <v-col xs8>
              <v-text-field
                  name="sku"
                  label="Enter SKU"
                  v-model="product.sku"
                  required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row row>
            <v-col xs4>
              <v-subheader>Supplier</v-subheader>
            </v-col>
            <v-col xs8>
              <v-select
                  v-bind:items="supplierNames"
                  v-model="product.supplier"
                  label="Select"
                  light
                  single-line
                  auto
                  required
              />
            </v-col>
          </v-row>

          <v-row row>
            <v-col xs4>
              <v-subheader>Type</v-subheader>
            </v-col>
            <v-col xs8>
              <v-select
                  v-bind:items="productTypes"
                  v-model="product.type"
                  label="Select"
                  light
                  single-line
                  auto
                  required
              />
            </v-col>
          </v-row>

          <v-row row>
            <v-col xs4>
              <v-subheader>Brand</v-subheader>
            </v-col>
            <v-col xs8>
              <v-select
                  v-bind:items="supplierBrands"
                  v-model="product.brand"
                  label="Select"
                  light
                  single-line
                  auto
                  required
              />
            </v-col>
          </v-row>

          <v-row row>
            <v-col xs4>
              <v-subheader>Cost Price</v-subheader>
            </v-col>
            <v-col xs8>
              <v-text-field
                  name="costPrice"
                  label="Enter initial cost price"
                  v-model="product.costPrice"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row row>
            <v-col xs4>
              <v-subheader>Sell Price</v-subheader>
            </v-col>
            <v-col xs8>
              <v-text-field
                  name="sellPrice"
                  label="Enter initial selling price"
                  v-model="product.sellPrice"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row row>
            <v-col xs4>
              <v-subheader>Weight</v-subheader>
            </v-col>
            <v-col xs8>
              <v-text-field
                  name="weight"
                  label="Enter weight, unit g"
                  v-model="product.weight"
              ></v-text-field>
              <span class="weight-unit">g</span>
            </v-col>
          </v-row>

          <v-row row>
            <v-col xs4>
              <v-subheader>Initial Stock Location</v-subheader>
            </v-col>
            <v-col xs8>
              <v-select
                  v-bind:items="warehouseLocations"
                  v-model="product.stockLocation"
                  label="Select"
                  light
                  single-line
                  auto
              />
            </v-col>
          </v-row>

          <v-card-title class="card-title">
            Product variant
          </v-card-title>

          <!--<v-row row>-->
          <!--<v-col xs4>-->
          <!--<v-subheader>Variant option</v-subheader>-->
          <!--</v-col>-->
          <!--<v-col xs8>-->
          <!--<v-subheader>Option values</v-subheader>-->
          <!--</v-col>-->
          <!--</v-row>-->

          <v-row row>
            <v-col xs4>
              <v-subheader>Color</v-subheader>
            </v-col>
            <v-col xs8>
              <v-text-field
                  name="color"
                  label="e.g. Red"
                  v-model="product.color"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row row>
            <v-col xs4>
              <v-subheader>Size</v-subheader>
            </v-col>
            <v-col xs8>
              <v-text-field
                  name="size"
                  label="e.g. Large"
                  v-model="product.size"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="btn-row" row>
            <v-btn success dark v-on:click.native="create(product)" to="/createProduct" router>
              Create product
            </v-btn>

            <v-btn class="cancel-button" default dark to="/inventory" router>
              Cancel
            </v-btn>
          </v-row>

        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import Breadcrumbs from '../breadcrumbs.vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {

    name: 'createProduct',

    components: {
      Breadcrumbs
    },

    // Todo: loading page legacy because of the getters loading data
    computed: mapGetters([
      'supplierNames',
      'supplierBrands',
      'productTypes',
      'warehouseLocations'
    ]),

    methods: {
      ...mapActions([
        'createProduct'
      ]),

      create (product) {
        this.createProduct(product);
      }
    },

    data () {
      return {
        breadcrumbs: [
          {
            text: 'Inventory',
            href: window.location.href.replace('createProduct', 'inventory'),
            target: '_self'
          },
          { text: 'Create product'}
        ],
        states: [
          'A',
          'B'
        ],
        product: {
          name: '',
          sku: '',
          supplier: '',
          type: '',
          brand: '',
          costPrice: '',
          sellPrice: '',
          weight: '',
          stockLocation: '',
          color: '',
          size: ''
        }
      }
    }
  }
</script>

<style scoped>
  .create-product-form {
    padding: 0 15%;
  }

  .row {
    margin-bottom: -1.5rem;
  }

  .weight-unit {
    position: absolute;
    margin-top: -65px;
    margin-left: 43%;
  }

  .card-title {
    font-size: 25px;
    letter-spacing: 2px;
    text-align: left!important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .card-title:after {
    content: "";
    position: absolute;
    left: 0;
    margin-left: 15px;
    margin-top: 40px;
    width: 100px;
    height: 3px;
    background: #424242 !important;
  }

  .cancel-button {
    position: absolute;
    right: 0;
    /*right: 0*/
    /*margin-right*/
  }

  .btn-row {
    position: relative;
    margin: 0.5rem 0 0.5rem 0;
  }
</style>