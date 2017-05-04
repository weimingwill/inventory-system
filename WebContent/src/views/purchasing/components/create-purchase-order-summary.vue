<template>
  <v-container fluid class="detail-container">
    <v-row><p class="detail-content">Total Units: </p></v-row>
    <v-row><v-divider class="detail-divider"></v-divider></v-row>

    <v-row><p class="detail-content">Sub Total: </p></v-row>
    <v-row><v-divider class="detail-divider"></v-divider></v-row>

    <v-row><p class="detail-content">Tax(7%): </p></v-row>
    <v-row><v-divider class="detail-divider"></v-divider></v-row>

    <v-row><p class="detail-content">Total Cost: </p></v-row>
    <v-row><v-divider class="detail-divider"></v-divider></v-row>

    <v-row><p class="detail-content">*Currency: USD</p></v-row>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
      })
    }
  }

</script>

<style scoped>

</style>