<template>
  <v-card>
    <v-card-text>
      <v-card-row>
        <p class="card-title">{{ info.title }}</p>
      </v-card-row>
      <v-card-row>
        <p class="card-value">{{ info.unit }}{{ info.value}}</p>
      </v-card-row>

      <v-card-row>
        <div style="width: 100%">
          <v-icon class="mr-1 percentage-icon increase"
                  v-if="info.isIncreased">keyboard_arrow_up</v-icon>
          <v-icon class="mr-1 percentage-icon decrease"
                  v-else>keyboard_arrow_down</v-icon>
          <p class="card-percentage">
            <span v-bind:class="[{increase : info.isIncreased}, {decrease : !info.isIncreased}]">{{ info.percentage }}% </span>
            from last week</p>
        </div>
      </v-card-row>
    </v-card-text>
  </v-card>
</template>

<script>

  export default {
    name: 'Card',

    props: ['info'],

    data() {
      return {

      }
    }
  }
</script>

<style scoped>
  .card-title {
    font-size: 15px;
  }

  .card-value {
    font-size: 30px;
    font-weight: 500;
  }

  .action {
    float: left;
  }

  p {
    margin-bottom: 0;
  }

  .percentage-icon {
    float: left;
  }

  .increase {
    color: green;
  }

  .decrease {
    color: red;
  }
</style>