<template>
  <div class="home">
    home
  </div>
</template>

<script type="text/ecmascript-6">
  import * as Helpers from './modules/helpers'
  import API from '@api'

  const PAGE_NAME = 'HOME'

  export default {
    name: PAGE_NAME,
    components: {},
    data() {
      return {
      }
    },
    computed: {
      ...Helpers.computed
    },
    methods: {
      // ...Helpers.methods,
    },
    onShow() {
      console.log(this.list, 'vuex - home')
      API.Jwt.getToken()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .home
    width: 100%
    background yellow
</style>
