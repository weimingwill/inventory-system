<template>
  <v-container fluid class="detail-container">
    <v-row><h5>Product details</h5></v-row>

    <v-row><v-divider class="header-divider"></v-divider></v-row>


    <v-row><p class="detail-content">Name: {{ product.name }}</p></v-row>
    <v-row><p class="detail-content">Product type: {{ product.type }}</p></v-row>
    <v-row><p class="detail-content">Supplier: {{ getSupplierName(product.supplierId) }}</p></v-row>

    <v-row><v-divider class="detail-divider"></v-divider></v-row>

    <v-row><p class="detail-subheader">Stock Overview</p></v-row>

    <v-row><p class="detail-content">On hand: {{ product.onHand }}</p></v-row>
    <v-row><p class="detail-content">Committed: {{ product.committed }}</p></v-row>
    <v-row><p class="detail-content">Available: {{ product.available }}</p></v-row>
    <v-row><p class="detail-content">Incoming: {{ product.name }}</p></v-row>
    <v-row><p class="detail-content">Sold: {{ product.sold }}</p></v-row>

    <v-row><v-divider class="detail-divider"></v-divider></v-row>

    <v-row><p class="detail-subheader">Product Description</p></v-row>

    <v-row><p class="detail-content" v-if="product.description">{{ product.description }}</p>
    <p class="detail-content" v-else>This is description of the product
    </p></v-row>

  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: ['productId'],

    computed: {
      product() {
        return this.$store.getters.getProductById(this.productId);
      },
      ...mapGetters({
        getSupplierName: 'getSupplierNameById',
      })
    }
  }

</script>

<style scoped>

</style>