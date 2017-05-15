<template>
  <v-menu
      lazy
      v-model="menu"
      transition="v-scale-transition"
  >
    <v-text-field
        slot="activator"
        label="Date"
        v-model="date"
        prepend-icon="event"
        readonly
    ></v-text-field>
    <v-date-picker v-model="date" no-title scrollable actions>
    </v-date-picker>
  </v-menu>
</template>

<script>
  export default {
    name: 'DatePicker',

    watch: {
      date () {
        this.$emit('setDate', this.date);
      }
    },

    data() {
      return {
        date: '',
        menu: ''
      }
    }

  }

</script>