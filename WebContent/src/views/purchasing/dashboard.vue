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
                    <chart :type="'line'" :data="seriesData" :options="options"></chart>
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
        'getDashboardInfo'
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
        series: ['Product A', 'Product B'],
        temp: ''
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
</style>