<template>
  <div class="home">
    <navigation-bar title="首页"></navigation-bar>
    home
    <div @click="chooseFilesHandle">cos</div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import chooseFiles from '@utils/we-cos/upload'

  const PAGE_NAME = 'HOME'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        hh: 'heooloa a '
      }
    },
    async onLoad() {
      let data = {j: '123'}
      try {
        // let res = await API.Jwt.getToken({
        //   data,
        //   formatter(res) {
        //     return res
        //   },
        //   doctor() {
        //     // do some
        //   }
        // })
        // let ctx = this
        let res = await API.Jwt.getToken({
          data,
          formatter(err, res) {
            console.log(err)
            return res
          },
          doctor(res) {
          }
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      chooseFilesHandle() {
        chooseFiles().then(res => {
          console.log(res)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .home
    width: 100%
</style>
