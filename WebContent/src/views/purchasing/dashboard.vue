<template>
  <div>
    <breadcrumbs :items="breadcrumbs" :isSlim="true"></breadcrumbs>
    <v-container class="dashboard-container" fluid>
      <v-row>
        <v-col v-for="(action, index) in getDashboardAction" :key="index" xs2>
          <action-card :action="action"></action-card>
        </v-col>

        <v-col v-for="info in getDashboardInfo" :key="info.id" xs2>
          <info-card :info="info"></info-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col xs6 pr-5>
          <v-card>
            <v-toolbar class="cyan chart-toolbar">
              <v-toolbar-title class="chart-toolbar-title">Incoming Stock by Supplier</v-toolbar-title>

              <v-select
                  class="chart-toolbar-select"
                  v-bind:items="supplierSelectionNames"
                  v-model="supplierName"
                  dark
              />
            </v-toolbar>
            <v-container class="chart-container">
              <chart :type="'bar'" :data="incomingStockData" :options="incomingStockOptions"></chart>
            </v-container>
          </v-card>
        </v-col>

        <v-col xs6 pl-5>
          <v-card>
            <v-toolbar class="cyan chart-toolbar">
              <v-toolbar-title class="chart-toolbar-title">Total Cost by Supplier</v-toolbar-title>

              <v-select
                  class="chart-toolbar-select"
                  v-bind:items="supplierSelectionNames"
                  v-model="supplierName"
                  dark
              />
            </v-toolbar>
            <v-container class="chart-container">
              <chart :type="'bar'" :data="incomingCostData" :options="incomingStockOptions"></chart>
            </v-container>
          </v-card>
        </v-col>

      </v-row>

      <v-row>
        <v-col xs12>
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
  import ActionCard from '../components/dashboard-action-card.vue'
  import InfoCard from '../components/dashboard-info-card.vue'
  import Chart from '../components/chartjs.vue'

  import { mapGetters, mapActions } from 'vuex'


  export default {
    name: 'PurchasingDashboard',

    components: {
      Breadcrumbs,
      ActionCard,
      InfoCard,
      Chart
    },

    computed: {
      ...mapGetters([
        'getDashboardInfo',
        'getDashboardAction',
        'getPredictions',
        'getLabels',
        'getSales',
        'productTypes',
        'sizesOfType',
        'colorsOfType'
      ]),

      supplierSelectionNames () {
        let names = this.suppliers.map(s => s.name);
        names.unshift('All');
        return names;
      },

      supplierNames () {
        return this.suppliers.map(s => s.name);
      },

      supplierQuantity () {
        return this.suppliers.map(s => this.$store.getters.quantityBySupplier(s.id));
      },

      supplierCost () {
        return this.suppliers.map(s => this.$store.getters.costBySupplier(s.id));
      },

      seriesData () {
        let data = {
          labels: this.labels_3
        };
        data.datasets = this.series.map((e, i) => {
          return {
            data: this.data_3[i],
            label: this.series[i],
            borderColor: this.transparentBgColor[i].replace(/1\)$/, '.5)'),
            pointBackgroundColor: this.transparentBgColor[i],
            backgroundColor: this.transparentBgColor[i].replace(/1\)$/, '.5)')
          }
        });
        return data
      },
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

      supplierName () {
        if (this.supplierName !== 'All') {
          let variants = this.$store.getters.purchaseOrderVariantsBySupplierName(this.supplierName);
          this.incomingStockLabels = variants.map(v => v.name);
          this.stockChartData = variants.map(v => v.quantity);
          this.costChartData = variants.map(v => v.cost);
        } else {
          this.incomingStockLabels = this.supplierNames;
          this.stockChartData = this.supplierQuantity;
          this.costChartData = this.supplierCost;
          console.log('costChart', this.costChartData)
        }
        this.setIncomingStock();
      }
    },

    methods: {
      setIncomingStock () {
        // Incoming stock by supplier data
        this.incomingStockData = {
          labels: this.incomingStockLabels
        };
        this.incomingStockData.datasets = [{
          data: this.stockChartData,
          backgroundColor: this.transparentBgColor[1].replace(/1\)$/, '.5)')
        }];

        // Incoming cost by supplier data
        this.incomingCostData = {
          labels: this.incomingStockLabels
        }
        this.incomingCostData.datasets = [{
          data: this.costChartData,
          backgroundColor: this.transparentBgColor[1].replace(/1\)$/, '.5)')
        }]

      },

      setPredictions() {
        // Todo: find all related ids instead of one
        if (this.type && this.size && this.color) {
          let variantId = this.$store.getters.getVariantIdsByTypeColorSize(this.type, this.size, this.color);
          this.sales = this.$store.getters.getSales(variantId);
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
      this.type = this.$store.getters.productTypes[0];
      this.suppliers = this.$store.getters.purchaseOrderSuppliers;
      this.supplierName = this.supplierSelectionNames[0];
    },

    data () {
      return {
        breadcrumbs: [
          { text: 'Dashboard' }
        ],

        // incoming stock attributes
        supplierName: '',
        suppliers: [],

        incomingStockOptions: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{}],
            yAxes: [{
              ticks: {
                min: 0
              }
            }]
          },
          tooltips: {
            mode: 'label'
          }
        },

        incomingStockLabels: [],
        stockChartData: [],
        incomingStockData: {},

        costChartData: [],
        incomingCostData: {},

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

        backgroundColor: [
          '#1fc8db',
          '#fce473',
          '#42afe3',
          '#ed6c63',
          '#97cd76'
        ]
      }
    },
    created() {
      this.$store.dispatch('initWarehouse');
      this.$store.dispatch('initSupplier');
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