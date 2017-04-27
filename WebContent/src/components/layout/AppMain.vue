<template>
  <v-content class="pt-0">
    <v-container fluid>
      <transition mode="out-in">
        <router-view></router-view>
      </transition>
    </v-container>
  </v-content>
</template>

<script>
  export default {
  }
</script>

<style>
  .content {
    padding-left: 300px;
  }
</style>