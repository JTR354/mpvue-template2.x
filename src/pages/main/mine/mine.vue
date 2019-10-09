<template>
  <div class="mine">
    <navigation-bar title="我的"></navigation-bar>
    <button @click="pp">画图</button>
    <div class="panel">
      <img mode="aspectFill" src="/static/images/user.png" alt="" class="h-avatar">
    </div>
    <img v-for="(item, index) in 44" :key="index" mode="aspectFill" src="./user.png" alt="">
    mine
    <we-paint ref="wePaint" ></we-paint>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import AppPromise from '@utils/app-promise'
  import WePaint from '@components/we-paint/we-paint'
  import {findLast} from 'lodash'

  const PAGE_NAME = 'MINE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      WePaint
    },
    data() {
      return {
        count: 0
      }
    },
    onLoad() {
      // wx.showShareMenu({
      //   withShareTicket: true
      // })
      console.log(findLast)
      console.log(this.route)
      wx.env.imageUrl = 'https://123'
      console.log(wx.env, process.env)
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
        let options = {
          canvasId: 'we-paint',
          multiple: 1,
          panel: {
            el: '.panel'
          },
          els: [
            {
              el: '.panel',
              drawType: 'rect',
              color: '#fff'
            },
            {
              el: '.h-avatar',
              drawType: 'img',
              source: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/corp1%2F2019%2F07%2F01%2F1561952187961-%E5%BC%80%E5%BF%83%E6%9E%9C.jpg',
              mode: 'aspectFill',
              unLoad: false
            }
          ]
        }
        this.$refs.wePaint.action(options)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .mine
    width: 100%
</style>
