<template>
  <div>
    <breadcrumbs :items="breadcrumbs" :isSlim="true"></breadcrumbs>
    <v-container class="dashboard-container" fluid>
      <v-row>
        <v-col v-for="card in getDashboardInfo" :key="card.id" xs4>
          <card :info="card"></card>
        </v-col>
      </v-row>

      <v-row>
        <v-col xs6>
          <v-card>
            <v-toolbar class="cyan chart-toolbar">
              <v-toolbar-title class="chart-toolbar-title">Purchase Units</v-toolbar-title>

              <v-select
                  class="chart-toolbar-select"
                  v-bind:items="series"
                  v-model="temp"
                  dark
              />
            </v-toolbar>
            <v-container class="chart-container">
              <chart :type="'line'" :data="seriesData" :options="options"></chart>
            </v-container>
          </v-card>
        </v-col>

        <v-col xs6>
          <v-card>
            <v-toolbar class="cyan chart-toolbar">
              <v-toolbar-title class="chart-toolbar-title">Purchase Units</v-toolbar-title>

              <v-select
                  class="chart-toolbar-select"
                  v-bind:items="series"
                  v-model="temp"
                  dark
              />
            </v-toolbar>
            <v-container class="chart-container">
              <chart :type="'line'" :data="seriesData" :options="options"></chart>
            </v-container>
          </v-card>
        </v-col>

      </v-row>

      <v-row>
        <v-col xs12>
          <v-card>
            <v-toolbar class="chart-toolbar">
              <v-toolbar-title class="chart-toolbar-title">Demand Forecast</v-toolbar-title>

              <v-select
                  class="chart-toolbar-select"
                  v-bind:items="series"
                  v-model="temp"
                  label="Select product type"
                  dark
              />
              <v-select
                  class="chart-toolbar-select"
                  v-bind:items="series"
                  v-model="temp"
                  label="Select size"
                  dark
              />
              <v-select
                  class="chart-toolbar-select"
                  v-bind:items="series"
                  v-model="temp"
                  label="Select color"
                  dark
              />


            </v-toolbar>
            <v-container fluid class="demand-forecast-container">
              <!--<v-row>-->
              <!--<v-col xs2>-->
              <!--<v-container fluid class="demand-forecast-selection-container">-->
              <!--<p>Settings</p>-->
              <!--<v-select-->
              <!--class="chart-toolbar-select"-->
              <!--v-bind:items="series"-->
              <!--v-model="temp"-->
              <!--label="Select product type"-->
              <!--light-->
              <!--/>-->
              <!--<v-select-->
              <!--class="chart-toolbar-select"-->
              <!--v-bind:items="series"-->
              <!--v-model="temp"-->
              <!--label="Select size"-->
              <!--light-->
              <!--/>-->
              <!--<v-select-->
              <!--class="chart-toolbar-select"-->
              <!--v-bind:items="series"-->
              <!--v-model="temp"-->
              <!--label="Select color"-->
              <!--light-->
              <!--/>-->
              <!--From-->
              <!--<v-select-->
              <!--class="chart-toolbar-select"-->
              <!--v-bind:items="series"-->
              <!--v-model="temp"-->
              <!--label="Display range from"-->
              <!--light-->
              <!--/>-->
              <!--To-->
              <!--<v-select-->
              <!--class="chart-toolbar-select"-->
              <!--v-bind:items="series"-->
              <!--v-model="temp"-->
              <!--label="Display range end"-->
              <!--light-->
              <!--/>-->
              <!--</v-container>-->
              <!--</v-col>-->
              <!--<v-col xs10>-->
              <!--<v-container class="demand-forecast-chart-container" fluid>-->
              <chart :type="'line'" :data="predictionData" :options="predictionOptions"></chart>
              <!--</v-container>-->
              <!--</v-col>-->
              <!--</v-row>-->
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/breadcrumbs.vue'
  import Card from '../components/datacard.vue'
  import Chart from '../components/chartjs.vue'

  import { mapGetters, mapActions } from 'vuex'


  export default {
    name: 'PurchasingDashboard',

    components: {
      Breadcrumbs,
      Card,
      Chart
    },

    computed: {
      ...mapGetters([
        'getDashboardInfo',
        'getPredictions',
        'getLabels',
        'getSales'
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
        console.log(data)
        return data
      },

      predictionData () {
        let data = {
          labels: this.labels,
        }
        data.datasets = this.predictionSeries.map((e, i) => {
          return {
            data: this.chartData[i],
            label: this.predictionSeries[i],
            borderColor: this.backgroundColor_3[i].replace(/1\)$/, '.5)'),
            pointBackgroundColor: this.backgroundColor_3[i],
            backgroundColor: this.backgroundColor_3[i].replace(/1\)$/, '.5)')
          }
        })
        return data;
      },

    },

    data () {
      return {
        breadcrumbs: [
          { text: 'Dashboard' }
        ],

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
          [594, 357, 410, 444, 550, 421, 565]
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
        series: ['Product A', 'Product B'],
        temp: '',

        e1: '',
        sales: [],
        labels: [],
        predictions: [],
        predictionSeries: ['actual', 'prediction'],
        chartData: [],
        predictionOptions: {
          scales: {
            xAxes: [{}],
            yAxes: [{
              ticks: {}
            }]
          }
        }
      }
    },
    created() {
      this.$store.dispatch('initWarehouse');
      this.$store.dispatch('initSupplier');
      this.$store.dispatch('initInventory');
      this.$store.dispatch('initSales');
      this.$store.dispatch('initPurchasing');

      this.sales = this.getSales;
      this.predictions = this.getPredictions(this.sales);
      this.labels = this.getLabels;

      for (let i = 0; i < 20; i++) {
        this.labels.push('2017-1-1')
      }

      this.chartData = [this.sales, this.predictions];
      this.predictionOptions.scales.yAxes[0].ticks.min = Math.min.apply(null, this.sales);
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
</style>