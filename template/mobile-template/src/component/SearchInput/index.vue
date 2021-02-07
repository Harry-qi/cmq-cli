<template>
  <div class="search-box flex flex-a-c">
    <input
      type="text"
      class="search-input"
      :value="value"
      @keyup.enter="searchFn"
      @input="changeValue"
      @change="onChange"
    >
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    changeValue(e) {
      this.$emit('input', e.target.value)
    },
    onChange(e) {
      this.$emit('change', e.target.value)
    },
    searchFn() {
      this.$emit('search', this.value)
    }
  }
}
</script>

<style scoped lang="scss">
  .search-box{
    width: 690px;
    padding: 18px 50px;
    border: 3px solid #4E6EF2;
    border-radius: 18px;
    .search-input{
      border: none;
      outline: none;
      width: 552px;
      height: 38px;
      line-height: 1;
      font-size: 32px;
      color: #333;
      caret-color: #4E6EF2;
    }
    .search-icon{
      width: 38px;
      height: 38px;
      object-fit: contain;
    }
  }
</style>
