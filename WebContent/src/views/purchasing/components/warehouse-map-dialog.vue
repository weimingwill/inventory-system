<template>
  <v-dialog
      v-model="isDialogOpen"
      fullscreen
      lazy
      transition="v-dialog-bottom-transition" :overlay=false>
    <v-btn primary light outline slot="activator" id="dialog-activate-btn" class="mt-4">
      <v-icon left>replay</v-icon>
      Allocation Details
    </v-btn>
    <v-card>
      <v-card-row>
        <v-toolbar>
          <v-btn icon="icon" @click.native="isDialogOpen = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title class="text-xs-left">Variant Allocation</v-toolbar-title>
          <v-btn class="white--text" flat="flat" @click.native="isDialogOpen = false">
            Complete
          </v-btn>
        </v-toolbar>
      </v-card-row>

      <v-container id="map-container" fluid>
        <v-row>
          <v-col xs3>
            <v-card>
              <v-container id="variant-container" fluid>
                <v-row>
                  <v-col xs6>
                    <p class="text-xs-left allocate-subheader"><b>Allocated Variants</b></p>
                  </v-col>
                  <v-col xs6>
                    <!--<v-btn error small dark class="text-xs-right">Reset All Locations</v-btn>-->
                  </v-col>
                </v-row>
                <v-expansion-panel expand class="variant-panel">
                  <v-expansion-panel-content v-for="(variant,i) in variants" :key="i">
                    <div slot="header">
                      <v-row>
                        <v-col xs12>{{ variant.fullname }}</v-col>
                      </v-row>
                      <v-row>
                        <v-col xs12>
                          <b># to allocate: {{ variant.toAllocate }}</b>
                        </v-col>
                      </v-row>
                    </div>
                    <v-card>
                      <!--<v-btn error small dark outline class="ml-3">Reset Locations</v-btn>-->
                      <v-data-table
                          v-bind:headers="variantHeaders"
                          v-model="variant.allocations"
                          no-data-text="No allocation yet"
                          hide-actions
                      >
                        <template slot="items" scope="props">
                          <td>{{ props.item.location }}</td>
                          <td>{{ props.item.quantity }}</td>
                        </template>

                      </v-data-table>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <p class="text-xs-left allocate-subheader"><b>To Allocate</b></p>

                <variant-selection-list
                    :variants="selectionVariants"
                    v-on:variantSelected="variantSelected"
                >
                </variant-selection-list>

                <v-text-field
                    type="number"
                    v-model="quantity"
                    min="0"
                    label="Allocate quantity"
                ></v-text-field>

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

                <v-btn outline success class="allocate-btn" @click.native="allocate">Allocate</v-btn>
                <v-alert
                    v-for="successMsg in successMsgs"
                    :key="successMsg"
                    success
                    dismissible
                    v-model="successAlert">
                  {{ successMsg }}
                </v-alert>

                <v-alert
                    v-for="errorMsg in errorMsgs"
                    :key="errorMsg"
                    error
                    dismissible
                    v-model="errorAlert">
                    {{ errorMsg }}
                </v-alert>

                <v-alert
                    v-for="warningMsg in warningMsgs"
                    :key="warningMsg"
                    warning
                    dismissible
                    v-model="warningAlert">
                    {{ warningMsg }}
                </v-alert>

                <warehouse-allocation-table
                    v-if="shelfName || layerName || cellName"
                    :items="allocations"
                >
                </warehouse-allocation-table>
              </v-container>
            </v-card>
          </v-col>

          <v-col xs8>
            <warehouse-map
                :selectedShelfName="shelfName"
                :showWarehouseSelection="false"
                v-on:shelfSelected="selectShelf"
            ></warehouse-map>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import WarehouseMap from '../../warehouse/components/warehouse-map.vue'
  import VariantSelectionList from '../../components/variant-selection-list.vue'
  import WarehouseAllocationTable from '../../warehouse/components/warehouse-allocation-table.vue'
  import * as s from '../../../utils/setting'

  export default {
    name: 'WarehouseMapDialog',

    props: ['variants', 'order'],

    components: {
      WarehouseMap,
      VariantSelectionList,
      WarehouseAllocationTable
    },

    watch: {
      order() {
        this.resetCellVariantJoins();
      },

      variant() {
        this.resetAlert();
      },

      quantity() {
        this.resetAlert();
      },

      shelfName() {
        this.resetAlert();

        this.layerName = '';
        this.cellName = '';

        if (this.shelfName) {
          this.cellVariantJoins = this.getCellVariantsByShelfName(this.shelfName);
        }
      },

      layerName() {
        this.resetAlert();

        this.cellName = '';

        if (this.layerName) {
          this.cellVariantJoins = this.getCellVariantsByShelfLayerName(this.shelfName, this.layerName)
        }
      },

      cellName() {
        this.resetAlert();

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

    computed: {
      ...mapGetters([
        'shelveNames',
        'getLayerNames',
        'getCellNames',
        'getCellByNames',
        'getCellsByShelfLayerName',
        'getLayersOfShelf',
        'getLayerCapacity',
        'getShelfCapacity',
        'getObjectByAttr',
        'getObjectListByAttr',
        'fulfillCellVariantJoins',
        'fulfillVariants',
        'getCellVariantsByShelfLayerName',
        'getCellVariantsByShelfLayerCellName',
        'getCellVariantsByShelfName',
        'getVariantsOfCellVariants',
        'getVariantAllocations'
      ]),

      layerNames() {
        return this.getLayerNames(this.shelfName);
      },

      cellNames() {
        return this.getCellNames(this.shelfName, this.layerName);
      },

      selectionVariants () {
        return this.variants.filter(v => v.toAllocate > 0);
      },
    },

    methods: {
      ...mapActions([
        'allocateItems',
        'allocatePurchaseOrder'
      ]),

      // Todo: multi-selection on shelves, layers, cells and variants
      selectShelf (shelfName) {
        this.shelfName = shelfName;
      },

      variantSelected (variant) {
        this.variant = variant;
      },

      calculateUnAllocatedAmount (total, allocations) {
        if (allocations.length > 0) {
          return total - allocations.map(a => a.quantity).reduce((sum, quantity) => {
              return sum + quantity;
            })
        } else {
          return total;
        }
      },

      resetAlert() {
        this.warningMsgs = [];
        this.errorMsgs = [];
        this.successMsgs = [];
        this.successAlert = false;
        this.warningAlert = false;
        this.errorAlert = false;
      },

      getAllocatedQuantity () {
        if (this.cellVariantJoins.length > 0) {
          return this.cellVariantJoins.map(cv => cv.quantity).reduce((sum, quantity) => {
            return sum + quantity;
          })
        }
        return 0;
      },

      resetCellVariantJoins() {
        if (this.shelfName && this.layerName && this.cellName) {
          this.cellVariantJoins = this.getCellVariantsByShelfLayerCellName(this.shelfName, this.layerName, this.cellName);
        } else if (this.shelfName && this.layerName) {
          this.cellVariantJoins = this.getCellVariantsByShelfLayerName(this.shelfName, this.layerName)
        } else if (this.shelfName) {
          this.cellVariantJoins = this.getCellVariantsByShelfName(this.shelfName);
        } else {
          this.cellVariantJoins = []
        }
      },

      allocate () {
        this.resetAlert();
        this.quantity = parseInt(this.quantity);
        let canAllocate = true;


        if (Object.keys(this.variant).length === 0) {
          this.warningMsgs.push('Please select a variant');
          this.warningAlert = true;
          canAllocate = false;
        }

        if (isNaN(this.quantity) || this.quantity === 0) {
          this.warningMsgs.push('Please set allocation quantity');
          this.warningAlert = true;
          canAllocate = false;
        } else if (this.quantity > this.variant.toAllocate) {
          this.errorMsgs.push('Allocate quantity is larger than not-allocated quantity of this variant.');
          this.errorAlert = true;
          canAllocate = false;
        }

        let totalCapacity = 0
          , capacity;
        if (this.shelfName && this.layerName && this.cellName) {
          let cell = this.getCellByNames(this.shelfName, this.layerName, this.cellName);
          totalCapacity = cell.capacity;
        } else if (this.shelfName && this.layerName) {
          totalCapacity = this.getLayerCapacity(this.shelfName, this.layerName);
        } else if (this.shelfName) {
          totalCapacity = this.getShelfCapacity(this.shelfName);
        } else {
          this.warningMsgs.push('Please select a shelf');
          this.warningAlert = true;
          canAllocate = false;
        }

        capacity = totalCapacity - this.getAllocatedQuantity();
        if (this.quantity > capacity) {
          this.errorMsgs.push('To allocate quantity is larger than available capacity.');
          this.errorAlert = true;
          canAllocate = false;
        }

        if (canAllocate){
          this.allocateItems({
            variant: this.variant,
            quantity: this.quantity,
            orderId: this.order.id,
            shelfName: this.shelfName,
            layerName: this.layerName,
            cellName: this.cellName
          });

          this.allocatePurchaseOrder({
            order: this.order,
            variant: this.variant,
            quantity: this.quantity
          });

          this.$emit('itemsAllocated');
          this.successMsgs.push('Allocate successfully');
          this.successAlert = true;
        }
      },
    },

    data () {
      return {
        isDialogOpen: false,
        variant: {},
        quantity: 0,
        shelfName: '',
        layerName: '',
        cellName: '',
        cellVariantJoins: [],
        searchVariantTable: '',
        successMsgs: [],
        warningMsgs: [],
        errorMsgs: [],
        warningMsg: '',
        errorMsg: '',
        successAlert: false,
        warningAlert: false,
        errorAlert: false,

        variantHeaders: [{
          text: 'Location',
          left: true,
          value: 'location'
        }, {
          text: 'Quantity',
          left: true,
          value: 'quantity'
        }],

        allocations: [],
        allocationHeaders: s.ALLOCATION_HEADERS
      }
    }
  }
</script>

<style scoped>
  .toolbar {
    width: 84.5%;
  }

  .dialog-card {
    width: 85%;
  }

  #map-container {
    padding: 0 0 0 20px;
    margin-top: -36px;
  }

  #variant-container {
    padding: 10px 10px;
  }

  .allocate-subheader {
    margin-top: 0.75rem;
    margin-left: 0.5rem;
    font-size: 15px;
  }

  .variant-panel {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
</style>

<style>
  .dialog--fullscreen {
    width: 91%;
  }

  .variant-panel .expansion-panel__header {
    height: 4rem;
  }

  .allocate-btn {
    width: 100%
  }
</style>