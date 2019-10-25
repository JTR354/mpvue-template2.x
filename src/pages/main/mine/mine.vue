<template>
  <div class="mine">
    <button @click="pp">button</button>
    <div class="panel">
      <img mode="aspectFill" src="/static/images/user.png" alt="" class="h-avatar">
    </div>
    <img src="https://social-shopping-api-1254297111.picgz.myqcloud.com/corp1%2F2019%2F07%2F01%2F1561952187961-%E5%BC%80%E5%BF%83%E6%9E%9C.jpg" alt="" mode="widthFix" style="width: 100vw">
    <div class="ex">
      <p>1</p>
      <p2>2</p2>
    </div>
<!--    <img v-for="(item, index) in dataArray" :key="index" mode="aspectFill" src="/static/images/user.png" alt="">-->
<!--    <block v-for="(item, index) in 4">-->
<!--      <p :key="index">{{index}}</p>-->
<!--    </block>-->
    mine
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import AppPromise from '@utils/app-promise'
  // import chooseFiles from '@utils/we-cos/upload'
  // import WePaint from '@components/we-paint/we-paint'
  // import wx from 'wx'

  const PAGE_NAME = 'MINE'

  export default {
    name: PAGE_NAME,
    components: {
    },
    data() {
      return {
        count: 0,
        dataArray: new Array(4).fill({})
      }
    },
    onLoad() {
      AppPromise.getInstance().then(res => {
        this.launch()
      })
    },
    onShow() {
      AppPromise.getInstance().then(res => {
        this.hello()
      })
    },
    methods: {
      hello() {
        this.count++
        console.log('hello on show' + this.count)
      },
      launch() {
        console.log('launch')
      },
      pp() {
        // chooseFiles().then(res => {
        //   console.log(res)
        // })
        mpvue.navigateTo({url: this.$pages.hello})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .mine
    width: 100%
  .ex
    layout(row)
</style>
