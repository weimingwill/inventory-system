<template>
  <div>
    <breadcrumbs :items="breadcrumbs"></breadcrumbs>
    <div class="tool-card">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="searchContent"
        ></v-text-field>
        <v-btn outline success dark to="/purchasing" router>
          <v-icon left>add</v-icon>
          New Purchase Order
        </v-btn>
      </v-card-title>
    </div>
    <div>
      <p>Prediction</p>
      <p>{{ getPredictison  }}</p>
    </div>
    <header></header>

    <v-card>
      <chart :type="'line'" :data="seriesData" :options="options"></chart>
    </v-card>
  </div>


</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import Chart from '../components/chartjs.vue'

  import { mapGetters, mapActions } from 'vuex'

  export default {

    name: 'Reorder',

    computed: {
      ...mapGetters([
        'getPredictions'
      ]),

      seriesData () {
        let data = {
          labels: this.labels_3
        }
        data.datasets = this.series.map((e, i) => {
          return {
            data: this.data_3[i],
            label: this.series[i],
            borderColor: this.backgroundColor_3[i].replace(/1\)$/, '.5)'),
            pointBackgroundColor: this.backgroundColor_3[i],
            backgroundColor: this.backgroundColor_3[i].replace(/1\)$/, '.5)')
          }
        })
        return data
      }
    },

    components: {
      Breadcrumbs,
      Chart
    },

    data () {
      return {
        breadcrumbs: [
          { text: 'Reorder' }
        ],
        predictions: this.getPredictison,
        searchContent: '',

        backgroundColor: [
          '#1fc8db',
          '#fce473',
          '#42afe3',
          '#ed6c63',
          '#97cd76'
        ],
        labels_3: ['May', 'June', 'Jule', 'August', 'September', 'October', 'November'],
        data_3: [
          [65, 59, 90, 81, 56, 55, 40],
          [28, 48, 40, 19, 88, 27, 45]
        ],
        options: {
          tooltips: {
            mode: 'label'
          }
        },
        backgroundColor_3: [
          'rgba(31, 200, 219, 1)',
          'rgba(151, 205, 118, 1)'
        ],
        series: ['Product A', 'Product B']
      }
    },

    created() {
      this.$store.dispatch('initWarehouse');
      this.$store.dispatch('initSupplier');
      this.$store.dispatch('initInventory');
      this.$store.dispatch('initPurchasing');
    },

  }
</script>

<style scoped>
  .tool-card {
    margin: -100px 0 -1px 0;
    right: 0;
  }
</style>