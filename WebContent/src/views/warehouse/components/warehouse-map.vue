<template>
  <v-card id="warehouse-card">
    <v-toolbar class="warehouse-toolbar">
      <v-toolbar-title class="warehouse-title text-xs-left">Warehouse Map</v-toolbar-title>

      <v-select
          v-if="showWarehouseSelection"
          class="warehouse-select"
          v-bind:items="warehouseLocations"
          v-model="warehouse"
          dark
      />
    </v-toolbar>

    <v-container class="warehouse-container" fluid>
      <v-row>
        <v-col xs12>
          <!-- Warehouse common shelves-->
          <v-row v-for="(row, index) in commonShelvesInRows" :key="index">
            <v-col class="shelf common-shelf" xs1 v-for="shelf in commonShelvesInRows[5 - index]" :key="shelf.id">
              {{ shelf.name }}
            </v-col>
          </v-row>

          <v-row class="bounding-area">
            <!-- Inbound areas-->
            <v-col xs2>
              <v-row>
                <v-col xs12 class="functional-area">
                  Quality Check
                </v-col>
              </v-row>

              <v-row>
                <v-col xs12 class="functional-area">
                  Receiving
                </v-col>
              </v-row>

              <v-row>
                <v-col offset-xs2 xs8 class="functional-area">
                  Inbound Entrance
                </v-col>
              </v-row>
            </v-col>

            <v-col xs10 class="outbound-area">
              <!-- Popular area and Cross docking area-->
              <v-row>
                <v-col xs1 v-for="shelf in popularShelves" :key="shelf.id" class="shelf popular-shelf">
                  {{ shelf.name }}
                </v-col>
              </v-row>

              <v-row>
                <v-col xs1 v-for="shelf in crossDockingShelves" :key="shelf.id" class="shelf cross-docking-shelf">
                  {{ shelf.name }}
                </v-col>
              </v-row>

              <!-- Outbound area -->
              <v-row>
                <v-col xs12>
                  <v-row>
                    <v-col offset-xs5 xs5 class="functional-area">
                      Packing
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col offset-xs8 xs2 class="functional-area">
                      Shipping
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col offset-xs8 xs2 class="functional-area">
                      Outbound Entrance
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs3 v-for="(item, index) in colorLabels" :key="index">
          <v-row class="mt-2 mb-2">
            <v-col xs5 class="">{{ item.label }}</v-col>
            <v-col xs2 class="shelf-label" v-bind:style="{ background: item.base }"></v-col>
            <v-col xs2 class="shelf-label-filled" v-bind:style="{ background: item.color }"></v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import * as s from '../../../utils/setting'

  export default {
    name: 'WarehouseMap',

    props: ['selectedShelfName', 'showWarehouseSelection'],

    watch: {
      selectedShelfName () {
        let shelf = this.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'fullname', this.selectedShelfName);
        let $shelves = document.getElementsByClassName('shelf');
        let i;

        for (i = 0; i < $shelves.length; i++) {
          if ($shelves[i].textContent.trim() === shelf.name) {
            break;
          }
        }
        $shelves[i].click();
      }
    },

    computed: {
      ...mapGetters([
        'shelves',
        'warehouseLocations',
        'getObjectByAttr',
        'commonShelvesInRows',
        'popularShelves',
        'crossDockingShelves',
        'getSupplierShelfNames',
        'getShelfFilledPercentage',
        'getShelfFilledBackgroundColor'
      ]),

      colorLabels () {
        return s.WAREHOUSE_COLORS;
      }
    },

    methods: {
      selectShelf: function (shelfName) {
        let shelf = this.getObjectByAttr(s.MODULE_WAREHOUSE, s.OBJ_SHELVES, 'name', shelfName.trim());
        this.shelfName = shelf.fullname;
        this.$emit('shelfSelected', this.shelfName);
      }
    },

    data() {
      return {
        breadcrumbs: [
          { text: 'Warehouse' }
        ],
        warehouse: '',
        shelfName: ''
      }
    },

    created() {
      this.$store.dispatch('initApp');
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

      let shelfNames, shelfName, percentage, $selectedShelves;

      Array.from(s.WAREHOUSE_COLORS).forEach(c => {
        switch (c.type) {
          case 'popular':
            $selectedShelves = document.getElementsByClassName('popular-shelf');
            break;
          case 'crossDocking':
            $selectedShelves = document.getElementsByClassName('cross-docking-shelf');
            break;
          default:
            $selectedShelves = document.getElementsByClassName('common-shelf');
        }
        if (c.type === 'common') {
          shelfNames = this.getSupplierShelfNames(c.supplierId);
        }
        Array.from($selectedShelves).forEach($shelf => {
          shelfName = $shelf.textContent.trim();
          if ((c.type === 'common' && shelfNames.includes(shelfName)) || c.type !== 'common') {
            percentage = this.getShelfFilledPercentage(shelfName);
            $shelf.style.background = this.getShelfFilledBackgroundColor(c.base, c.color, percentage);
          }
        })
      });
    },

    beforeDestory() {
      let $shelves = document.getElementsByClassName('shelf');
      Array.from($shelves).forEach($shelf => $shelf.removeEventListener('click', () => this.selectShelf($shelf.textContent)));
    }
  }
</script>

<style scoped>
  .warehouse-container {
    padding: 10px 20px 10px 20px;
  }

  #warehouse-card {
    margin-bottom: 4rem;
  }

  .shelf-label, .shelf-label-filled {
    padding: 0.5rem;
  }

  .shelf, .functional-area {
    border: 1px solid lightgray;
    padding: 1rem;
    margin: 0.5rem 0.65rem 0.5rem 0.65rem;
    text-align: center;
    vertical-align: middle;
  }

  .shelf:hover {
    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px rgba(0,0,0,.14),0 1px 14px rgba(0,0,0,.12);
    cursor: pointer;
  }

  .shelf {
    /*background: linear-gradient(to top, #c4e8ae 0%, rgba(0, 0, 0, 0) 10%);*/
    /*background-color: #efffe5;*/
  }

  .active {
    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px rgba(0,0,0,.14),0 1px 14px rgba(0,0,0,.12)
  }

  .shelf:active {
    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px rgba(0,0,0,.14),0 1px 14px rgba(0,0,0,.12)
  }

  .bounding-area {
    margin-top: 1rem;
  }

  .outbound-area {
    padding-left: 2rem;
    padding-right: 0;
  }


  /* Toolbar */
  .warehouse-toolbar {
    position: relative;
    padding: 0 14px !important;
  }

  .warehouse-select {
    margin: 16px 0 0 16px;
  }
</style>