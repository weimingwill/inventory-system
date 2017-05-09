<template>
  <div id="app">
    <v-app top-toolbar left-sidebar>
      <main>
        <sidebar></sidebar>
        <app-main></app-main>
      </main>
    </v-app>
  </div>
</template>

<script>
  // Todo: simplify the import syntax --> solve error in webpack for index.js
  //  import { Sidebar, AppMain } from './components/layout/'
  import Sidebar from './views/layout/Sidebar.vue'
  import AppMain from './views/layout/AppMain.vue'

  export default {
    name: 'app',
    components: {
      Sidebar,
      AppMain
    }
  }
</script>

<style lang="stylus">
  @import '../node_modules/vuetify/src/stylus/main';
  @import 'css/google-material-icons.css';
  @import 'css/main.css';
</style>
