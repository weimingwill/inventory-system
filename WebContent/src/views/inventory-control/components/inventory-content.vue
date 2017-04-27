<template>
  <v-tabs>
    <v-tab-item
        v-for="i in 3" :key="i"
        v-bind:href="'#mobile-tabs-3-' + i"
        slot="activators"
    >
      Item {{ i }}
    </v-tab-item>
    <v-tab-content
        v-for="i in 3" :key="i"
        v-bind:id="'mobile-tabs-3-' + i"
        slot="content"
    >
      <v-card>

        <!--<p>Items: {{ items }}</p>-->

        <v-data-table
            v-bind:headers="headers"
            v-model="items"
            v-bind:search="searchContent"
            select-all
        >

          <template slot="items" scope="props">
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
            <td class="">{{ props.item.supplier }}</td>
            <td class="">{{ props.item.brand }}</td>
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

    computed: mapGetters({
      items: 'products'
    }),

    data () {
      return {
        headers: [{
          text: '',
          left: true,
          sortable: false,
          value: 'name',
        }, {
          text: 'Name',
          value: 'name',
          left: true
        }, {
          text: 'Type',
          value: 'type',
          left: true
        }, {
          text: 'Supplier',
          value: 'supplier',
          left: true
        }, {
          text: 'Brand',
          value: 'brand',
          left: true
        }, {
          text: 'On Hand',
          value: 'onHand',
          left: true
        }, {
          text: 'Available',
          value: 'available',
          left: true
        }, {
          text: 'Committed',
          value: 'committed',
          left: true
        }, {
          text: 'Status',
          value: 'status',
          left: true
        }, {
          text: 'Created',
          value: 'created',
          left: true
        }],
        e3: ''
      }
    }
  }
</script>

<style>
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
