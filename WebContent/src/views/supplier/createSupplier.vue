<template>
  <div>
    <breadcrumbs :items="breadcrumbs"></breadcrumbs>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'

  export default {

    name: 'createSupplier',

    components: {
      Breadcrumbs
    },

    data () {
      return {
        breadcrumbs: []
      }
    },

    mounted() {
      let urlsParts = window.location.href.split('/');
      urlsParts.pop();
      this.breadcrumbs = [
        {
          text: 'Supplier',
          href: urlsParts.join('/'),
          target: '_self'
        },
        { text: 'Create Supplier'}
      ];
    }
  }
</script>

<style scoped>
</style>