<template>
  <div class="hello-world">
    <!--<navigation-bar title="world"></navigation-bar>-->
    hello-world
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  // import API from '@api'
  // import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'HELLO_WORLD'

  export default {
    name: PAGE_NAME,
    components: {
      // NavigationBar
    },
    data() {
      return {
      }
    },
    computed: {
      // ...Helpers.helloWorldComputed,
    },
    methods: {
      // ...Helpers.helloWorldMethods,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .hello-world
    width: 100%
</style>
