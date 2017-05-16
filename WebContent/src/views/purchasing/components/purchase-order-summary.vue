<template>
  <v-container fluid class="detail-container">
    <v-row>
      <v-col xs6>Total Units: </v-col>
      <v-col xs6 class="text-xs-right">{{ totalUnits }}</v-col>
    </v-row>
    <v-row><v-divider class="detail-divider"></v-divider></v-row>

    <!--<v-row><p class="detail-content">Sub Total: </p></v-row>-->
    <!--<v-row><v-divider class="detail-divider"></v-divider></v-row>-->

    <!--<v-row><p class="detail-content">Tax(7%): </p></v-row>-->
    <!--<v-row><v-divider class="detail-divider"></v-divider></v-row>-->

    <v-row>
      <v-col xs6>Total Cost: </v-col>
      <v-col xs6 class="text-xs-right">${{ totalCost }}</v-col>
    </v-row>
    <v-row><v-divider class="detail-divider"></v-divider></v-row>

    <v-row>
      <v-col xs12>
        *Currency: USD
      </v-col>
    </v-row>

    <v-row class="btn-row">
      <v-btn v-if="isCreate" class="fn-btn" success light @click.native="createOrder">Create</v-btn>
      <!-- Todo: add edit function -->
      <v-btn v-else-if="isEdit" class="fn-btn" success light @click.native="editOrder">Save</v-btn>
    </v-row>

    <v-row class="btn-row">
      <v-btn v-if="isCreate" class="fn-btn" success light outline>Save as draft</v-btn>
    </v-row>

    <v-row class="btn-row">
      <v-btn v-if="isCreate" class="fn-btn" default light outline to="/purchaseOrders">Cancel</v-btn>
      <v-btn v-if="isEdit" class="fn-btn" default light outline @click.native="cancel">Cancel</v-btn>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'PurchaseSummary',

    props: ['orderedItems', 'orderDetails', 'isEdit', 'isCreate', 'isInbound', 'status'],

    computed: {
      ...mapGetters({
      }),

      totalUnits() {
        let totalUnits = 0;
        Array.from(this.orderedItems).forEach(item => {
          let quantity = item.quantity;
          if (quantity !== '') {
            quantity = parseInt(quantity);
            totalUnits += quantity;
          }
        });
        return totalUnits;
      },

      totalCost() {
        let totalCost = 0;
        Array.from(this.orderedItems).forEach(item => {
          let quantity = item.quantity;
          if (quantity !== '') {
            quantity = parseInt(quantity);
            totalCost += quantity * item.costPrice;
          }
        });
        return totalCost
      }
    },

    methods: {
      createOrder() {
        this.$emit('createPurchase')
      },

      cancel() {
        this.$router.replace('/purchaseOrders/view/' + this.$route.params.id);
      },

      editOrder() {
        // Todo: add function to update order
      },
    },

    data() {
      return {
      }
    }
  }

</script>

<style scoped>
  .detail-container {
    padding: 10px 20px 20px 20px;
  }

  .row {
    font-size: 15px;
    font-weight: bold;
  }

  .btn-row {
    margin-top: 5px;
    padding: 0 10px 0 0;
  }

  .btn-row:first-of-type {
    margin-top: 30px;
  }

  .fn-btn {
    width: 100%;
  }

  .detail-divider {
    margin: 15px 0 15px 0;
  }
</style>