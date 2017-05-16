<template>
  <v-select
      v-bind:items="variants"
      v-model="variant"
      item-text="fullname"
      item-value="fullname"
      light
      chips
      max-height="auto"
      autocomplete
      label="Select variant"
  >
    <template slot="selection" scope="data">
      <v-chip
          @input="data.parent.selectItem(data.item)"
          @click.native.stop
          class="chip--select-multi"
          :key="data.item"
      >
        <v-avatar>
          <img :src="data.item.image">
        </v-avatar>
        {{ data.item.fullname }}
      </v-chip>
    </template>
    <template slot="item" scope="data">
      <v-list-tile-avatar>
        <img v-bind:src="data.item.image"/>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title v-html="data.item.fullname"/>
      </v-list-tile-content>
    </template>
  </v-select>
</template>

<script>
  export default {
    name: 'VariantSelectionList',
    props: ['variants'],

    watch: {
      variant() {
        this.$emit('variantSelected', this.variant);
      }
    },

    data () {
      return {
        variant: {}
      }
    }
  }
</script>