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

          <template slot="items" scope="props">
            <td ref="productIdTd" class="product-id-td">
              <v-checkbox
                  hide-details
                  primary
                  v-model="props.item.value"
              ></v-checkbox>
              <input
                  name="props.item.id"
                  v-model="props.item.id"
                  type="hidden"
                   />
            </td>

            <td class="image-td">
              <img class="product-image" :src="props.item.image">
            </td>
            <td class="">{{ props.item.name }}</td>
            <td class="">{{ props.item.type }}</td>
            <td class="">{{ getSupplierName(props.item.supplierId) }}</td>
            <td class="">{{ getBrand(props.item.supplierId) }}</td>
            <td class="">{{ props.item.incoming }}</td>
            <td class="">{{ props.item.onHand }}</td>
            <td class="">{{ props.item.available }}</td>
            <td class="">{{ props.item.committed }}</td>
            <td class="">{{ props.item.status }}</td>
            <td class="">{{ props.item.created }}</td>
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
      rowOnClick: function (id) {
        this.$router.replace('/inventory/' + id)
      }
    },

    created() {
      if (this.items.length === 0) {
        this.$store.dispatch('initWarehouse');
        this.$store.dispatch('initSupplier');
        this.$store.dispatch('initInventory');
      }
    },

    mounted() {
      Array.from(this.$refs.productIdTd).forEach(($td) => {
        $td.parentNode.addEventListener('click', () => this.rowOnClick($td.lastChild.value))
      });

      // Do not go trigger click row if checkbox is clicked
      let $checkboxes = document.getElementsByClassName('checkbox');
      Array.from($checkboxes).forEach($checkbox => {
        $checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      })
    },

    beforeDestroy() {
      Array.from(this.$refs.productIdTd).forEach(($td) => {
        $td.parentNode.removeEventListener('click', () => this.rowOnClick($td.lastChild.value))
      });
    },

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
          text: 'Incoming',
          value: 'incoming',
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
        e3: '1'
      }
    }
  }
</script>

<style scoped>
  table tbody tr td:hover {
    cursor: pointer;
  }

  .datatable {
    margin-bottom: 200px;
  }
</style>

<style>
  .tabs__items {
    border-bottom-width: 0;
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
