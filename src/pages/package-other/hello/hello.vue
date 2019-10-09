<template>
  <div class="hello">
    hello
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  // import API from '@api'

  const PAGE_NAME = 'HELLO'

  export default {
    name: PAGE_NAME,
    components: {},
    data() {
      return {
      }
    },
    computed: {
      // ...Helpers.computed,
    },
    methods: {
      // ...Helpers.methods,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .hello
    width: 100%
</style>
