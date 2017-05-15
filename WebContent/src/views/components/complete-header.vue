<template>
  <div>
    <v-icon medium class="green--text text--darken-2 completed-icon">check_circle</v-icon>
    <h6 class="completed-text">
      <span>text</span>
    </h6>
  </div>
</template>

<script>
  export default {
    name: 'CompleteHeader',
    props: ['text']
  }
</script>