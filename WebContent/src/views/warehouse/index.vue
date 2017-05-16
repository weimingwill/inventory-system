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
          <!--<v-card id="warehouse-card">-->
            <!--<v-toolbar class="warehouse-toolbar">-->
              <!--<v-toolbar-title class="warehouse-title">Warehouse Map</v-toolbar-title>-->

              <!--<v-select-->
                  <!--class="warehouse-select"-->
                  <!--v-bind:items="warehouseLocations"-->
                  <!--v-model="warehouse"-->
                  <!--dark-->
              <!--/>-->
            <!--</v-toolbar>-->

            <!--<v-container class="warehouse-container" fluid>-->
              <!--<v-row>-->
                <!--<v-col xs12>-->
                  <!--&lt;!&ndash; Warehouse common shelves&ndash;&gt;-->
                  <!--<v-row v-for="(row, index) in commonShelves" :key="index">-->
                    <!--<v-col class="shelf" xs1 v-for="shelf in row" :key="shelf.id">-->
                      <!--{{ shelf.name }}-->
                    <!--</v-col>-->
                  <!--</v-row>-->

                  <!--<v-row class="bounding-area">-->
                    <!--&lt;!&ndash; Inbound areas&ndash;&gt;-->
                    <!--<v-col xs2>-->
                      <!--<v-row>-->
                        <!--<v-col xs12 class="functional-area">-->
                          <!--Quality Check-->
                        <!--</v-col>-->
                      <!--</v-row>-->

                      <!--<v-row>-->
                        <!--<v-col xs12 class="functional-area">-->
                          <!--Receiving-->
                        <!--</v-col>-->
                      <!--</v-row>-->

                      <!--<v-row>-->
                        <!--<v-col offset-xs2 xs8 class="functional-area">-->
                          <!--Inbound Entrance-->
                        <!--</v-col>-->
                      <!--</v-row>-->
                    <!--</v-col>-->

                    <!--<v-col xs10 class="outbound-area">-->
                      <!--&lt;!&ndash; Popular area and Cross docking area&ndash;&gt;-->
                      <!--<v-row>-->
                        <!--<v-col xs1 v-for="shelf in popularShelves" :key="shelf.id" class="shelf">-->
                          <!--{{ shelf.name }}-->
                        <!--</v-col>-->
                      <!--</v-row>-->

                      <!--<v-row>-->
                        <!--<v-col xs1 v-for="shelf in crossDockingShelves" :key="shelf.id" class="shelf">-->
                          <!--{{ shelf.name }}-->
                        <!--</v-col>-->
                      <!--</v-row>-->

                      <!--&lt;!&ndash; Outbound area &ndash;&gt;-->
                      <!--<v-row>-->
                        <!--<v-col xs12>-->
                          <!--<v-row>-->
                            <!--<v-col offset-xs5 xs5 class="functional-area">-->
                              <!--Packing-->
                            <!--</v-col>-->
                          <!--</v-row>-->

                          <!--<v-row>-->
                            <!--<v-col offset-xs8 xs2 class="functional-area">-->
                              <!--Shipping-->
                            <!--</v-col>-->
                          <!--</v-row>-->

                          <!--<v-row>-->
                            <!--<v-col offset-xs8 xs2 class="functional-area">-->
                              <!--Outbound Entrance-->
                            <!--</v-col>-->
                          <!--</v-row>-->
                        <!--</v-col>-->
                      <!--</v-row>-->

                    <!--</v-col>-->
                  <!--</v-row>-->
                <!--</v-col>-->
              <!--</v-row>-->
            <!--</v-container>-->
          <!--</v-card>-->
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

              <v-data-table
                  v-if="layerName || cellName"
                  v-bind:headers="headers"
                  v-model="items"
                  rows-per-page="6"
              >
                <template slot="items" scope="props">
                  <td>{{ props.item.variantName }}</td>
                  <td>{{ props.item.quantity }}</td>
                  <td>{{ props.item.cellName }}</td>
                </template>
              </v-data-table>
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
  import * as s from '../../utils/setting'

  export default {
    name: 'warehouse',

    components: {
      Breadcrumbs,
      WarehouseMap
    },

    computed: {
      ...mapGetters([
        'shelves',
        'shelveNames',
        'warehouseLocations',
        'fulfillCellVariantJoins',
        'getObjectByAttr',
        'getObjectListByAttr',
        'getCellVariantJoinByCell',
        'getCells',
        'getLayers'
      ]),

      commonShelves() {
        let rows = [];
        let shelves = this.shelves.filter(shelve => shelve.name.charAt(0) === 'C');
        let numOfRow = shelves.length / 10;
        for (let i = 0; i < numOfRow; i++) {
          let row = [];
          for (let j = 0; j < 10; j++) {
            row.push(this.shelves[i * 10 + j]);
          }
          rows.push(row);
        }
        return rows;
      },

      popularShelves() {
        return this.shelves.filter(shelve => shelve.name.charAt(0) === 'P');
      },

      crossDockingShelves() {
        return this.shelves.filter(shelve => shelve.name.charAt(0) === 'T');
      },

      layerNames() {
        this.layers = this.getLayers(this.shelfName);
        return this.layers.map(layer => {
          return layer.fullname;
        });
      },

      cellNames() {
        this.cells = this.getCells(this.shelfName, this.layerName);
        return this.cells.map(cell => {
          return cell.name
        });
      },

    },

    watch: {
      shelfName: function () {
        this.layerName = '';
        this.cellName = '';
      },

      layerName: function () {
        this.cellName = '';

        if (this.layerName) {
          this.cells = this.getCells(this.shelfName, this.layerName);
          let cellVariantJoins = [];
          for (let i = 0; i < this.cells.length; i++) {
            let cell = this.cells[i];
            let cellVariantJoin = this.getObjectListByAttr(s.MODULE_WAREHOUSE, s.OBJ_CELL_VARIANT, 'cellId', cell.id);
            cellVariantJoin = cellVariantJoin.map(cv => {
              cv.cellName = cell.name;
              return cv;
            });
            cellVariantJoins = cellVariantJoins.concat(cellVariantJoin);
          }
          cellVariantJoins = this.fulfillCellVariantJoins(cellVariantJoins);
          this.items = cellVariantJoins;
        }
      },

      cellName: function () {
        if (this.cellName) {
          let cellVariantJoin = this.getCellVariantJoinByCell(this.cellName, this.cells);
          cellVariantJoin = this.fulfillCellVariantJoins(cellVariantJoin);
          this.items = cellVariantJoin;
        }
      }
    },

    methods: {
      selectShelf: function (shelfName) {
        let shelf = this.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'name', shelfName.trim());
        this.shelfName = shelf.fullname;
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
        layers: [],
        cells: [],
        headers: [
          {
            text: 'Name',
            value: 'name',
            left: true,
          }, {
            text: 'Quantity',
            value: 'quantity',
            left: true,
          }, {
            text: 'Cell Name',
            value: 'cellName',
            left: true,
          }
        ],
        items: []
      }
    },

    created() {
      this.$store.dispatch('initWarehouse');
      this.$store.dispatch('initInventory');
    },

    mounted() {
      this.warehouse = this.warehouseLocations[0];
      let $shelves = document.getElementsByClassName('shelf');
      Array.from($shelves).forEach($shelf => $shelf.addEventListener('click', () => {
        // remove existing active class and add to the clicked one
        let $activeShelves = document.getElementsByClassName('active');
        if ($activeShelves.length > 0) {
          Array.from($activeShelves).forEach($shelf => {
            $shelf.className = $shelf.className.replace(/\bactive\b/,'');
          })
        }
        $shelf.className += " active";
        this.selectShelf($shelf.textContent);
      }));

      // Set height of variant container equal to map container
      let height = document.getElementById('warehouse-card').offsetHeight;
      document.getElementById('variant-container').style.height = height + 'px';
    },

    beforeDestory() {
      let $shelves = document.getElementsByClassName('shelf');
      Array.from($shelves).forEach($shelf => $shelf.removeEventListener('click', () => this.selectShelf($shelf.textContent)));
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