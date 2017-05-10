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
        <v-btn outline success dark to="/supplierContacts/createContact" router>
          <v-icon left>add</v-icon>
          New Contact
        </v-btn>
      </v-card-title>
    </div>
    <header></header>
    <v-row>
      <v-data-table
          v-bind:headers="headers"
          v-model="supplierContacts"
          v-bind:search="searchContent"
      >
        <template slot="items" scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ getSupplierById(props.item.supplierId).name }}</td>
          <td>{{ getSupplierById(props.item.supplierId).location }}</td>
          <td>{{ getSupplierById(props.item.supplierId).brand }}</td>
        </template>
      </v-data-table>
    </v-row>
  </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import { mapGetters, mapActions } from 'vuex'
  import * as s from '../../utils/setting'


  export default {

    name: 'supplierContacts',

    components: {
      Breadcrumbs
    },

    computed: {
      ...mapGetters([
        'getSupplierById'
      ])
    },

    data () {
      return {
        headers: [{
          text: 'Name',
          value: 'name',
          left: true
        }, {
          text: 'Email',
          value: 'email',
          left: true
        }, {
          text: 'Phone Number',
          value: 'phone',
          left: true
        }, {
          text: 'Supplier Name',
          value: 'supplier',
          left: true
        }, {
          text: 'Supplier Location',
          value: 'location',
          left: true
        }, {
          text: 'Supplier Brand',
          value: 'brand',
          left: true
        }
        ],
        breadcrumbs: [
          { text: 'Supplier Contacts'}
        ],
        searchContent: '',
        supplierId: '',
        supplierContacts: []
      }
    },

    created() {
      this.$store.dispatch('initSupplier');
    },

    mounted() {
      if (this.$route.params.id) {
        this.supplierId = parseInt(this.$route.params.id);
        let urlsParts = window.location.href.split('/');
        urlsParts.pop();
        urlsParts.pop();

        console.log(urlsParts.join('/'));
        this.breadcrumbs = [
          {
            text: 'Supplier',
            href: urlsParts.join('/'),
            target: '_self'
          },
          { text: 'Supplier Contacts'}
        ];

        this.supplierContacts = this.$store.getters.getObjectListByAttr(
          s.MODULE_SUPPLIER, s.OBJ_SUPPLIER_CONTACTS, 'supplierId', this.supplierId)
      } else {
        this.supplierContacts = this.$store.getters.supplierContacts;
      }
    }
  }
</script>

<style scoped>
  .tool-card {
    margin: -100px 0 -1px 0;
    right: 0;
  }
</style>