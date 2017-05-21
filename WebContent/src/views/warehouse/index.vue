<template>
  <div>
    <breadcrumbs :items="breadcrumbs" :isSlim="true"></breadcrumbs>
    <v-container id="map-container" fluid>
      <v-row>
        <v-col xs9>
          <warehouse-map
              :selectedShelfName="shelfName"
              :showWarehouseSelection="true"
              v-on:shelfSelected="selectShelf"
          ></warehouse-map>
        </v-col>

        <v-col xs3>
          <v-card>
            <v-container id="variant-container" fluid>
              <v-select
                  class="shelf-select"
                  v-bind:items="shelveNames"
                  v-model="shelfName"
                  label="Select shelf"
                  light
              />

              <v-select
                  v-if="shelfName"
                  v-bind:items="layerNames"
                  v-model="layerName"
                  label="Select layer"
                  light
              />

              <v-select
                  v-if="layerName"
                  v-bind:items="cellNames"
                  v-model="cellName"
                  label="Select cell"
                  light
              />

              <warehouse-allocation-table
                  v-if="shelfName || layerName || cellName"
                  :items="allocations"
              >
              </warehouse-allocation-table>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import Breadcrumbs from '../components/breadcrumbs.vue'
  import WarehouseMap from './components/warehouse-map.vue'
  import WarehouseAllocationTable from './components/warehouse-allocation-table.vue'

  import * as s from '../../utils/setting'

  export default {
    name: 'warehouse',

    components: {
      Breadcrumbs,
      WarehouseMap,
      WarehouseAllocationTable
    },

    computed: {
      ...mapGetters([
        'shelves',
        'shelveNames',
        'getLayerNames',
        'getCellNames',
        'warehouseLocations',
        'fulfillCellVariantJoins',
        'getObjectByAttr',
        'getObjectListByAttr',
        'getCellVariantsByShelfLayerCellName',
        'getCellsByShelfLayerName',
        'getLayersOfShelf',
        'getCellVariantsByShelfLayerName',
        'getCellVariantsByShelfLayerCellName',
        'getCellVariantsByShelfName',
        'getVariantAllocations',
        'getVariantsOfCellVariants',
      ]),

      layerNames () {
        return this.getLayerNames(this.shelfName);
      },

      cellNames () {
        return this.getCellNames(this.shelfName, this.layerName);
      },

    },

    watch: {
      shelfName () {
        this.layerName = '';
        this.cellName = '';

        if (this.shelfName) {
          this.cellVariantJoins = this.getCellVariantsByShelfName(this.shelfName);
        }
      },

      layerName () {
        this.cellName = '';

        if (this.layerName) {
          this.cellVariantJoins = this.getCellVariantsByShelfLayerName(this.shelfName, this.layerName)
        }
      },

      cellName () {
        if (this.cellName) {
          this.cellVariantJoins = this.getCellVariantsByShelfLayerCellName(this.shelfName, this.layerName, this.cellName);
        }
      },

      cellVariantJoins() {
        let variantIds = this.getVariantsOfCellVariants(this.cellVariantJoins);
        this.allocations = [];
        let cellVariants;
        Array.from(variantIds).forEach(variantId => {
          cellVariants = this.cellVariantJoins.filter(cv => cv.variantId === variantId);
          this.allocations = this.allocations.concat(this.getVariantAllocations(cellVariants));
        });
        this.allocations.sort((a, b) => a.location - b.location);
      }
    },

    methods: {
      selectShelf (shelfName) {
        this.shelfName = shelfName;
      }
    },

    data() {
      return {
        breadcrumbs: [
          { text: 'Warehouse' }
        ],
        warehouse: '',
        shelfName: '',
        layerName: '',
        cellName: '',
        headers: s.ALLOCATION_HEADERS,
        cellVariantJoins: [],
        allocations: []
      }
    },

    created() {
      this.$store.dispatch('initWarehouse');
      this.$store.dispatch('initInventory');
    },

    mounted() {
      // Set height of variant container equal to map container
      let height = document.getElementById('warehouse-card').offsetHeight;
      document.getElementById('variant-container').style.height = height + 'px';
    }
  }
</script>

<style scoped>
  #map-container {
    padding: 20px 0 0 20px;
  }

  #variant-container {
    padding: 10px 10px;
  }
</style>
