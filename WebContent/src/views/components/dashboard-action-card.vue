<template>
  <v-card :id="action.id" :data="action.href">
    <v-card-text>
      <v-card-row>
        <p class="card-title">{{ action.title }}</p>
      </v-card-row>

      <v-card-row>
        <p class="card-number">{{ action.number }}</p>
      </v-card-row>

      <v-card-row>
        <p class="card-unit">{{ action.unit }}</p>
      </v-card-row>

    </v-card-text>
  </v-card>
</template>

<script>

  export default {
    name: 'ActionCard',

    props: ['action'],

    methods: {
      cardClicked (href) {
        this.$router.replace(href);
      }
    },

    data() {
      return {

      }
    },

    mounted () {
      let $card = document.getElementById(this.action.id);
      $card.addEventListener('click', () => this.cardClicked($card.getAttribute('data')));
    }
  }
</script>

<style scoped>
  .card:hover {
    background: #f4f4f5;
    cursor: pointer;
  }

  .card-title {
    font-size: 15px;
  }

  .card-number {
    font-size: 30px;
    font-weight: 500;
    color: #F34336;
  }

  .card-unit {
    font-size: 15px;
  }

  p {
    margin-bottom: 0;
  }
</style>