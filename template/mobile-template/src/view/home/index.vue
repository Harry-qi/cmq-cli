<template>
  <div class="container">
    <van-search v-model="searchWord" placeholder="请输入搜索关键词" />

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
