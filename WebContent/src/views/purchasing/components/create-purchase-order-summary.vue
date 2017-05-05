<template>
  <v-container fluid class="detail-container">
    <v-row><p class="detail-content">Total Units: {{ totalUnits }}</p></v-row>
    <v-row><v-divider class="detail-divider"></v-divider></v-row>

    <!--<v-row><p class="detail-content">Sub Total: </p></v-row>-->
    <!--<v-row><v-divider class="detail-divider"></v-divider></v-row>-->

    <!--<v-row><p class="detail-content">Tax(7%): </p></v-row>-->
    <!--<v-row><v-divider class="detail-divider"></v-divider></v-row>-->

    <v-row><p class="detail-content">Total Cost: ${{ totalCost }}</p></v-row>
    <v-row><v-divider class="detail-divider"></v-divider></v-row>

    <v-row><p class="detail-content">*Currency: USD</p></v-row>

    <v-row class="btn-row">
      <v-btn class="fn-btn" success light>Create</v-btn>
    </v-row>

    <v-row class="btn-row">
      <v-btn class="fn-btn" success light outline>Save as draft</v-btn>
    </v-row>

    <v-row class="btn-row">
      <v-btn class="fn-btn" default light outline>Cancel</v-btn>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: ['orderedItems'],

    computed: {
      ...mapGetters({
      }),

      totalUnits: function () {
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

      totalCost: function () {
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

    data() {
      return {
      }
    }
  }

</script>

<style scoped>
  .btn-row {
    margin-top: 5px;
    padding: 0 10px 0 0;
  }

  .btn-row:first-of-type {
    margin-top: 20px;
  }

  .fn-btn {
    width: 100%;
  }
</style>