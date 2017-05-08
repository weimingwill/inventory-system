<template>
  <v-breadcrumbs
      divider="/"
      v-bind:class="{ slim : isSlim }"
  >
    <v-breadcrumbs-item
        v-for="item in items" :key="item"
        :href="item.href"
        :target="item.target"
        :disabled="item.disabled"
    >
      {{ item.text }}
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
  export default {
    name: 'BreadCrumbs',
    props: {
      items: Array,
      isSlim: Boolean
    }
  }
</script>

<style>
  .breadcrumbs {
    padding: 40px 0 35px 10px;
    background-color: #f4f4f5;
    justify-content: flex-start;
  }

  .slim {
    padding: 20px 0 15px 10px;
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