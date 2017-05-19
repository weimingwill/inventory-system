<template>
  <div class="loader-div" v-show="loading">
    <pulse-loader class="loader" :loading="loading" :color="color" :size="size"></pulse-loader>
  </div>
</template>

<script>
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

  export default {
    name: 'Loader',

    props: ['loading'],

    components: {
      PulseLoader
    },

    data () {
      return {
        color: '#1976d2',
        size: '20px'
      }
    },
  }
</script>

<style>
  .loader-div {
    position: absolute;
    top:0;
    bottom: 0;
    right: 0;
    width: 84.3%;
    height: 100%;
    background-color: rgba(0,0,0,.3);
    z-index: 1000;
  }

  .loader {
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100px;
    height: 100px;
  }
</style>