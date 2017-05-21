<template>
  <v-card>
    <v-toolbar class="demand-forecast-chart-toolbar">
      <v-toolbar-title class="chart-toolbar-title">Demand Forecast</v-toolbar-title>

      <v-select
          class="chart-toolbar-select"
          v-bind:items="productTypes"
          v-model="type"
          label="Select product type"
          dark
      />

      <v-select
          class="chart-toolbar-select"
          v-bind:items="colors"
          v-model="color"
          label="Select color"
          dark
      />

      <v-select
          class="chart-toolbar-select"
          v-bind:items="sizes"
          v-model="size"
          label="Select size"
          dark
      />

    </v-toolbar>
    <v-container fluid class="demand-forecast-container">

      <chart :type="'line'" :data="predictionData" :options="predictionOptions"></chart>

    </v-container>
  </v-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Chart from '../../components/chartjs.vue'

  export default {
    name: 'DemandForecast',

    props: ['productType'],

    components: {
      Chart
    },

    computed: {
      ...mapGetters([
        'getPredictions',
        'getLabels',
        'getSales',
        'getVariantIdsByTypeColorSize',
        'productTypes',
        'sizesOfType',
        'colorsOfType'
      ]),
    },

    watch: {
      type () {
        if (this.type) {
          this.sizes = this.sizesOfType(this.type);
          this.colors = this.colorsOfType(this.type);
          this.size = this.sizes[0];
          this.color = this.colors[0];
        }
        this.setPredictions();
      },

      size () {
        this.setPredictions();
      },

      color () {
        this.setPredictions();
      },

      demandChartData () {
        this.predictionData = {
          labels: this.labels,
        };
        this.predictionData.datasets = this.predictionSeries.map((e, i) => {
          return {
            data: this.demandChartData[i],
            label: this.predictionSeries[i],
            borderColor: this.transparentBgColor[i].replace(/1\)$/, '.5)'),
            pointBackgroundColor: this.transparentBgColor[i],
            backgroundColor: this.transparentBgColor[i].replace(/1\)$/, '.5)')
          }
        });
      },
    },

    methods: {

      setPredictions() {
        // Todo: find all related ids instead of one
        if (this.type && this.size && this.color) {
          let variantId = this.getVariantIdsByTypeColorSize(this.type, this.size, this.color);
          this.sales = this.getSales(variantId);
          this.predictions = this.getPredictions(this.sales);
          this.labels = this.getLabels(variantId);

          let year = 2017;
          let month = 1;
          for (let i = 0; i < 12; i++) {
            this.labels.push([year, month].join('-'));
            if (month === 12) {
              month = 1;
              year++;
            } else {
              month++
            }
          }
          this.predictionOptions.scales.yAxes[0].ticks.min = Math.min.apply(null, this.sales.concat(this.predictions.slice(this.sales.length)));
          this.demandChartData = [this.sales, this.predictions];
        }
      }
    },

    mounted() {
      this.type = this.productType;
    },

    data () {
      return {
        // demand forecast attributes
        sales: [],
        labels: [],
        predictions: [],
        predictionSeries: ['actual', 'prediction'],
        demandChartData: [],
        predictionOptions: {
          scales: {
            xAxes: [{}],
            yAxes: [{
              ticks: {}
            }]
          }
        },
        predictionData: {},

        type: '',
        size: '',
        color: '',
        sizes: [],
        colors: [],

        transparentBgColor: [
          'rgba(31, 200, 219, 1)',
          'rgba(151, 205, 118, 1)'
        ],
      }
    },

    created() {
      this.$store.dispatch('initInventory');
      this.$store.dispatch('initSales');
      this.$store.dispatch('initPurchasing');
    },
  }
</script>

<style scoped>
  .row {
    margin-bottom: 1.5rem;
  }

  .chart-container {
    padding-top: 10px;
    padding-bottom: 5px;
  }

  .chart-toolbar {
    height: 50px;
  }

  .chart-toolbar-title {
    font-size: 17px;
  }

  .chart-toolbar-select {
    margin: 16px 0 0 16px;
  }

  .demand-forecast-container {
    padding: 20px 20px;
  }

  .demand-forecast-chart-container {
    padding-left: 20px;
  }

  .demand-forecast-chart-toolbar {
    height: 80px;
  }
</style>