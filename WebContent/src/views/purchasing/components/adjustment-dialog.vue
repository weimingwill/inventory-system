<template>
  <v-dialog
      v-model="isDialogOpen"
      persistent
      lazy
      width="600"
  >
    <v-btn error slot="activator">Adjustment</v-btn>
    <v-card>
      <v-card-row>
        <v-card-title>Adjustment</v-card-title>
      </v-card-row>
      <v-card-row>
        <v-card-text>
          <v-container fluid class="text-xs-left">
            <v-row>
              <v-col xs6>
                <date-picker v-on:setDate="setDate"></date-picker>
              </v-col>

              <v-col xs1>
                <v-checkbox
                    primary
                    hide-details
                    v-model="adjustment.shouldReturn"
                >
                </v-checkbox>
              </v-col>
              <v-col xs5 class="text-xs-left">
                <p class="col-text">Return to supplier</p>
              </v-col>
            </v-row>

            <v-select
                v-bind:items="adjustStatuses"
                v-model="adjustment.status"
                light
                label="Select status"
            />

            <v-select
                v-bind:items="adjustReasons"
                v-model="adjustment.reason"
                light
                label="Select Reason"
            />

            <table class="datatable table">
              <thead>
              <tr>
                <th v-for="header in headers">
                  {{ header.text }}
                </th>
              </tr>
              </thead>

              <tbody ref="itemTbody">
              <tr v-for="(item, index) in adjustment.variants">
                <td class="image-td">
                  <img class="product-image" :src="item.image">
                </td>
                <td>{{ item.fullname }} </td>
                <td class="quantity-td">
                  <v-text-field
                      class="quantity-input"
                      type="number"
                      name="quantity"
                      v-model="item.quantity"
                  ></v-text-field>
                </td>
                <td class="delete-td">
                  <v-btn icon="icon" class="black--text" @click.native="deleteItem(item.variantId)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>

              <tr ref="newItemRow" v-show="hasNewItem">
                <td class="image-td">
                </td>
                <td>
                  <variant-list
                      :searchContent="newItem.searchContent"
                      :items="adjustment.variants"
                      :variants="variants"
                      v-on:itemClicked="setItem"
                  ></variant-list>
                </td>
                <td class="quantity-td">
                  <v-text-field
                      class="quantity-input"
                      type="number"
                      name="quantity"
                      v-model="newItem.quantity"
                  ></v-text-field>
                </td>
                <td class="delete-td">
                  <v-btn icon="icon" class="black--text" @click.native="deleteNewItem">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </table>

            <v-btn @click.native="addNewItem" default light class="add-item-btn" :disabled="hasNewItem">
              <v-icon>add</v-icon>Add another item
            </v-btn>
          </v-container>
        </v-card-text>
      </v-card-row>
      <v-card-row actions>
        <v-btn class="blue--text darken-1" flat @click.native="isDialogOpen = false">Close</v-btn>
        <v-btn class="blue--text darken-1" flat @click.native="addAdjustment">Save</v-btn>
      </v-card-row>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import * as s from '../../../utils/setting'

  import VariantList from './variant-list.vue'
  import DatePicker from "../../components/date-picker";

  export default {
    name: 'AdjustmentDialog',

    props: ['order', 'variants'],

    components: {
      DatePicker,
      VariantList
    },

    computed: {
      ...mapGetters([
        'getVariantById'
      ])
    },

    methods: {
      ...mapActions([
        'adjustPurchaseOrder'
      ]),

      addNewItem: function () {
        this.hasNewItem = true;
      },

      deleteNewItem: function () {
        this.hasNewItem = false;
      },

      deleteItem: function (variantId) {
        this.adjustment.variants = this.adjustment.variants.filter(v => v.variantId !== variantId);
      },

      setDate (date) {
        this.adjustment.date = date;
      },

      setItem: function (variantId) {
        let variant = this.getVariantById(variantId);
        this.newItem.variantId = variantId;
        this.newItem.image = variant.image;
        this.newItem.fullname = variant.fullname;
        this.newItem.quantity = 1;
        this.newItem.searchContent = '';
        this.adjustment.variants.push(Object.assign({}, this.newItem));
        this.hasNewItem = false;
      },

      addAdjustment () {
        this.isDialogOpen = false;
        this.adjustPurchaseOrder({
          order: this.order,
          adjustment: this.adjustment
        });
        this.$emit('addAdjustment');
      }
    },

    mounted () {
      // Todo reset data once close and open again
      // reset data
      this.adjustment = {
        date: '',
        status: '',
        reason: '',
        shouldReturn: false,
        variants: []
      };
      this.hasNewItem = false;
      this.filteredVariants = [];
      this.newItem = {
        variantId: 0,
        fullname: '',
        quantity: '',
        searchContent: ''
      }
    },

    data() {
      return {
        adjustment: {
          date: '',
          status: '',
          reason: '',
          shouldReturn: false,
          variants: []
        },

        hasNewItem: false,
        filteredVariants: [],
        newItem: {
          variantId: 0,
          fullname: '',
          quantity: '',
          searchContent: ''
        },

        adjustReasons: s.ADJUST_REASONS,
        adjustStatuses: s.ADJUST_STATUSES,
        isDialogOpen: false,

        headers: [{
          text: '',
        },{
          text: 'Item Name',
        }, {
          text: 'Quantity',
        }],
      }
    }
  }

</script>

<style scoped>
  .col-text {
    margin-top: 23px;
  }
</style>

<style>
  .dialog {
    margin: 24px 40px 24px 300px;
    /*width: 600px !important;*/
  }

  .add-item-btn {
    width: 100%;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .product-image {
    width: 40px;
    height: auto;
  }

  .image-td {
    padding-top: 6px!important;
  }

  .delete-td {
    padding-left: 0;
    padding-right: 0;
  }

  .quantity-td {
    padding-left: 0;
    padding-right: 0;
    width: 50px;
  }

  .quantity-input {
    width: 50px;
  }

</style>