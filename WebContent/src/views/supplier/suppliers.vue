<template>
  <div>
    <breadcrumbs :items="breadcrumbs"></breadcrumbs>
    <div class="tool-card">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="searchContent"
        ></v-text-field>
        <v-btn outline success dark to="/suppliers/createSupplier" router>
          <v-icon left>add</v-icon>
          New Supplier
        </v-btn>
      </v-card-title>
    </div>

    <v-data-table
        v-bind:headers="headers"
        v-model="suppliers"
        v-bind:search="searchContent"
    >
      <template slot="items" scope="props">
        <td class="supplier-td hidden"><input v-model="props.item.id"></td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.location }}</td>
        <td>{{ props.item.brand }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>

  import Breadcrumbs from '../components/breadcrumbs.vue'

  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'suppliers',

    components: {
      Breadcrumbs
    },

    computed: {
      ...mapGetters([
        'suppliers',
      ])
    },

    methods: {
      rowOnClick: function (id) {
        this.$router.replace('/suppliers/' + id + '/supplierContacts')
      }
    },

    created() {
      this.$store.dispatch('initSupplier');
    },

    mounted() {
      let $supplierIdTds =document.getElementsByClassName('supplier-td');
      Array.from($supplierIdTds).forEach(($td) => {
        $td.parentNode.addEventListener('click', () => this.rowOnClick($td.firstChild.value))
      });
    },

    beforeDestroy() {
      let $supplierIdTds =document.getElementsByClassName('supplier-td');
      Array.from($supplierIdTds).forEach(($td) => {
        $td.parentNode.removeEventListener('click', () => this.rowOnClick($td.firstChild.value))
      });
    },

    data () {
      return {
        headers: [{
          text: 'Name',
          left: true,
          value: 'name',
        }, {
          text: 'Location',
          value: 'location',
          left: true
        }, {
          text: 'Brand',
          value: 'brand',
          left: true
        }],
        breadcrumbs: [
          { text: 'Suppliers' },
        ],
        searchContent: ''
      }
    }
  }
</script>

<style scoped>
  .tool-card {
    margin: -100px 0 -1px 0;
    right: 0;
  }

  table tbody tr:hover td {
    cursor: pointer !important;
  }

</style>
