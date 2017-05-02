<template>
  <v-tabs>
    <v-tab-item
        v-for="i in 1" :key="i"
        v-bind:href="'#mobile-tabs-3-' + i"
        slot="activators"
    >
      All
      <!--Item {{ i }}-->
    </v-tab-item>
    <v-tab-content
        v-for="i in 1" :key="i"
        v-bind:id="'mobile-tabs-3-' + i"
        slot="content"
    >
      <v-card>
        <v-data-table
            v-bind:headers="headers"
            v-model="items"
            v-bind:search="searchContent"
            select-all
        >

          <template slot="items" scope="props" class="template-datatable">
            <td>
              <v-checkbox
                  hide-details
                  primary
                  v-model="props.item.value"
              ></v-checkbox>
            </td>

            <td class="image-td">
              <img class="product-image" :src="props.item.image">
            </td>

            <!--<td>-->
            <!--<v-edit-dialog-->
            <!--@open="props.item._name = props.item.name"-->
            <!--@cancel="props.item.name = props.item._name || props.item.name"-->
            <!--lazy-->
            <!--&gt; {{ props.item.name }}-->
            <!--<v-text-field-->
            <!--slot="input"-->
            <!--label="Edit"-->
            <!--v-bind:value="props.item.name"-->
            <!--v-on:change="val => props.item.name = val"-->
            <!--single-line counter="counter"-->
            <!--&gt;</v-text-field>-->
            <!--</v-edit-dialog>-->
            <!--</td>-->
            <td class="">{{ props.item.name }}</td>
            <td class="">{{ props.item.type }}</td>
            <td class="">{{ getSupplierName(props.item.supplierId) }}</td>
            <td class="">{{ getBrand(props.item.supplierId) }}</td>
            <td class="">{{ props.item.onHand }}</td>
            <td class="">{{ props.item.available }}</td>
            <td class="">{{ props.item.committed }}</td>
            <td class="">{{ props.item.status }}</td>
            <td class="">{{ props.item.created }}</td>
            <!--<td>-->
            <!--<v-edit-dialog-->
            <!--class="text-xs-right"-->
            <!--@open="props.item._iron = props.item.iron"-->
            <!--@cancel="props.item.iron = props.item._iron || props.item.iron"-->
            <!--large-->
            <!--lazy-->
            <!--&gt;-->
            <!--<div class="text-xs-right">{{ props.item.iron }}</div>-->
            <!--<div slot="input" class="mt-3 title">Update Iron</div>-->
            <!--<v-text-field-->
            <!--slot="input"-->
            <!--label="Edit"-->
            <!--v-bind:value="props.item.iron"-->
            <!--v-on:blur="val => props.item.iron = val"-->
            <!--single-line-->
            <!--counter-->
            <!--autofocus-->
            <!--&gt;</v-text-field>-->
            <!--</v-edit-dialog>-->
            <!--</td>-->
          </template>
        </v-data-table>
      </v-card>
    </v-tab-content>
  </v-tabs>
</template>

<script>

  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: ['searchContent'],

    computed: {
      ...mapGetters({
        items: 'products',
        getSupplierName: 'getSupplierNameById',
        getBrand: 'getBrandById'
      })
    },

    methods: {

    },

    created() {
      if (this.items.length === 0) {
        this.$store.dispatch('initInventory')
      }
    },

    data () {
      return {
        headers: [{
          text: 'Order #',
          left: true,
          sortable: false,
          value: 'orderNum',
        }, {
          text: 'Supplier',
          value: 'supplier',
          left: true
        }, {
          text: 'Status',
          value: 'status',
          left: true
        }, {
          text: 'Receive',
          value: 'receive',
          left: true
        }, {
          text: 'Quantity',
          value: 'quantity',
          left: true
        }, {
          text: 'Total Cost',
          value: 'totalCost',
          left: true
        }, {
          text: 'Due',
          value: 'due',
          left: true
        }, {
          text: 'Received At',
          value: 'receivedAt',
          left: true
        }, {
          text: 'Created',
          value: 'created',
          left: true
        }, {
          text: 'Updated',
          value: 'updated',
          left: true
        }],
        e3: ''
      }
    }
  }
</script>

<style>
  .tabs__items {
    border-bottom-width: 0;
  }

  .datatable {
    margin-bottom: 200px;
  }

  .rotate-180 {
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
  }

  .tools {
    margin-top: -10px;
  }

  .product-image {
    width: 40px;
    height: auto;
  }

  .image-td {
    padding-top: 6px!important;
  }
</style>
