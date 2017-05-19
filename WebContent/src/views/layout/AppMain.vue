<template>
  <v-content class="pt-0">
    <v-container fluid>
      <loader :loading="loading"></loader>
      <transition mode="out-in">
        <router-view></router-view>
      </transition>
    </v-container>
  </v-content>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Loader from '../components/loader.vue'

  export default {

    components: {
      Loader
    },

    computed: {
      ...mapGetters([
        'loading'
      ]),
    },

    created () {
      this.$store.dispatch('initApp');
      this.$store.dispatch('initNotifications');
    },
  }
</script>

<style>
  .content {
    padding-left: 300px;
  }
</style>