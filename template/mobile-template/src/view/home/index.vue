<template>
  <div class="container">
    <search-input v-model="searchWord" @search="search" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchWord: ''
    }
  },
  methods: {
    search() {
      console.log('hello')
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding-top: 380px;
    width: 690px;
    margin: 0 auto;
  }
</style>
