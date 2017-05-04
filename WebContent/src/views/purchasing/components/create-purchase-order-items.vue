<template>
  <v-container fluid class="items-container">
    <order-items></order-items>
    <!--<received-items></received-items>-->
    <!--<adjust-items></adjust-items>-->
  </v-container>

</template>

<script>

  import OrderItems from './order-items.vue'

  import { mapGetters, mapActions } from 'vuex'



  export default {
    computed: {
    },

    components: {
      OrderItems
    },

    methods: {
      ...mapActions([
      ])
    },

    created() {
    },

    data () {
      return {
        headers: [{
          text: 'Item name',
          left: true,
          sortable: false,
        }, {
          text: 'Quantity',
          value: 'quantity',
          left: true
        }, {
          text: 'Stock after purchase',
          value: 'afterPurchase',
          left: true
        }, {
          text: 'Item unit cost',
          value: 'cost',
          left: true
        }, {
          text: 'Tax',
          value: 'tax',
          left: true
        }, {
          text: 'Total',
          value: 'total',
          left: true
        }],
        items: [''],
      }
    }
  }
</script>

<style scoped>
  .items-container {
    padding-right: 10px;
  }
</style>
