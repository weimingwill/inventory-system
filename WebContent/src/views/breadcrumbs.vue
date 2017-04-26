<template>
  <v-breadcrumbs divider="/">
    <v-breadcrumbs-item
        v-for="item in items" :key="item"
        :disabled="item.disabled"
    >
      {{ item.text }}
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
  export default {
    props: {
      items: Array
    }
  }
</script>

<style>
  .breadcrumbs {
    padding: 40px 0 35px 10px;
    background-color: #f4f4f5;
    justify-content: flex-start;
  }

  .breadcrumbs li:last-child a {
    font-size: 20px;
    color: #828282;
  }

  .breadcrumbs__item {
    align-items: inherit;
    color: #bdbdbd;
    display: inline-flex;
    height: 0;
    text-decoration: none;
    line-height: 0px;
  }
</style>