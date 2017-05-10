<template>
  <div>
    <breadcrumbs :items="breadcrumbs"></breadcrumbs>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'

  export default {

    name: 'createSupplierContact',

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
          text: 'Supplier Contacts',
          href: urlsParts.join('/'),
          target: '_self'
        },
        { text: 'Create Supplier Contact'}
      ];
    }
  }
</script>

<style scoped>
</style>