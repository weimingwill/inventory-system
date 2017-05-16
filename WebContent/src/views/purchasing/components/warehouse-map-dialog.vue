<template>
  <v-dialog v-model="isDialogOpen" fullscreen transition="v-dialog-bottom-transition" :overlay=false>
    <v-btn primary light outline slot="activator" class="mt-4">
      <v-icon left>replay</v-icon>
      Stock Allocation
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
                <p class="text-xs-left"><b>Allocated Variants</b></p>
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

                <v-data-table
                    class="variant-table"
                    v-if="shelfName || layerName || cellName"
                    v-bind:headers="allocationHeaders"
                    v-model="cellVariantJoins"
                >
                  <template slot="items" scope="props">
                    <td class="image-td">
                      <img class="product-image" :src="props.item.image">
                    </td>
                    <td>{{ props.item.fullname }}</td>
                    <td>{{ props.item.quantity }}</td>
                    <td>{{ props.item.layerName }}</td>
                    <td>{{ props.item.cellName }}</td>
                  </template>
                </v-data-table>
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
  import * as s from '../../../utils/setting'

  export default {
    name: 'WarehouseMapDialog',

    props: ['variants', 'order'],

    components: {
      WarehouseMap,
      VariantSelectionList
    },

    watch: {
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
          this.cellVariantJoins = this.getCellVariantByShelf(this.shelfName);
        }
      },

      layerName() {
        this.resetAlert();

        this.cellName = '';

        if (this.layerName) {
          this.cellVariantJoins = this.getCellVariantJoinByLayer(this.shelfName, this.layerName)
        }
      },

      cellName() {
        this.resetAlert();

        if (this.cellName) {
          this.cellVariantJoins = this.getCellVariantJoinByCell(this.shelfName, this.layerName, this.cellName);
        }
      }
    },

    computed: {
      ...mapGetters([
        'shelveNames',
        'getCell',
        'getCells',
        'getLayers',
        'getLayerCapacity',
        'getShelfCapacity',
        'getObjectByAttr',
        'getObjectListByAttr',
        'fulfillCellVariantJoins',
        'fulfillVariants',
        'getCellVariantJoinByLayer',
        'getCellVariantJoinByCell',
        'getCellVariantByShelf'
      ]),

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

      selectionVariants () {
        return this.variants.filter(v => v.toAllocate > 0);
      }
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

      allocate () {
        let canAllocate = true;

        if (Object.keys(this.variant).length === 0) {
          this.warningMsgs.push('Please select a variant');
          this.warningAlert = true;
          canAllocate = false;
        }

        if (!this.quantity || parseInt(this.quantity) === 0) {
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
          let cell = this.getCell(this.shelfName, this.layerName, this.cellName);
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
        layers: [],
        cells: [],
        successMsgs: [],
        warningMsgs: [],
        errorMsgs: [],
        warningMsg: '',
        errorMsg: '',
        cellVariantJoins: [],
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

        allocationHeaders: [{
          text: '',
          left: true,
          value: 'image',
        }, {
          text: 'Name',
          left: true,
          value: 'name',
          sortable: false,
        }, {
          text: 'Quantity',
          left: true,
          value: 'quantity',
          sortable: false,
        }, {
          text: 'Layer',
          left: true,
          value: 'layer',
          sortable: false,
        }, {
          text: 'Cell',
          left: true,
          value: 'cell',
          sortable: false,
        }]
      }
    }
  }
</script>

<style scoped>
  .toolbar {
    width: 84.5%;
  }

  .image-td {
    padding: 0 0 0 0 !important;
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

  .variant-panel {
    margin-top: 1rem;
    margin-bottom: 3rem;
  }

  .variant-table table tbody tr td {
    padding-left: 5px !important;
    padding-right: 5px !important;
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

  .variant-table table thead th {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
</style>