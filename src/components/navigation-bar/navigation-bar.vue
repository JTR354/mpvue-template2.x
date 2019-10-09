<template>
  <div id="navigationBar">
    <div class="head-item" :style="headStyleData" :class="showTitle ? '' : 'showNavigation'">
      <div class="status-bar" :style="{height: statusBarHeight + 'px'}"></div>
      <div class="head-content" :style="{color: titleColor}">
        {{currentTitle}}
        <div class="head-arrow" v-if="showArrow" @click="goBackUrl">
          <img src="./icon-title_back@2x.png" class="head-arrow-img">
        </div>
      </div>
    </div>
    <div v-if="!translucent" :style="{height: statusBarHeight + 44 + 'px'}"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  /* eslint-disable no-undef */
  import wx from 'wx'
  import app from '@src/app.json'

  function pageRouter() {
    return '/' + app.pages[0]
  }

  let DEFAULT_PAGE = pageRouter()

  export default {
    name: 'HEAD_ITEM',
    props: {
      // 标题
      title: {
        type: String,
        default: ''
      },
      // 头部背景颜色
      headStyle: {
        type: String,
        default: 'background: rgba(255, 255, 255, 1)'
      },
      // 是否显示返回箭头
      showArrow: {
        type: Boolean,
        default: true
      },
      // 标题文字颜色
      titleColor: {
        type: String,
        default: '#000000'
      },
      // 是否在点击返回时自定义方法
      custom: {
        type: Boolean,
        default: false
      },
      // 是否为沉浸式
      translucent: {
        type: Boolean,
        default: false
      },
      // 自定义沉浸式滚动fn
      hasTranslucentFn: {
        type: Boolean,
        default: false
      },
      arrowUrl: {
        type: String,
        default: '/zd-image/1.2/icon-title_back@2x.png'
      },
      hasTranslucentHeight: {
        type: Number,
        default: 100
      },
      exceedHeightFn: {
        type: Boolean,
        default: true
      },
      exceedHeight: {
        type: Number,
        default: 100
      },
      titleMaxLen: {
        type: Number,
        default: 10
      }
    },
    onPageScroll(e) {
      this._diyHeadNavigation(e)
      this._exceedHeadShow(e)
    },
    data() {
      return {
        statusBarHeight: 20,
        translucentTitle: this.title,
        headStyleData: this.headStyle,
        titleColorData: this.titleColor,
        showTitle: true
      }
    },
    created() {
      let res = mpvue.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this._initHeadStyle()
    },
    methods: {
      setNavigationBarTitle(title) {
        this.translucentTitle = title
      },
      setNavigationBarBackground(styles) {
        this.headStyleData = styles
      },
      getStatusBarHeight() {
        return this.statusBarHeight
      },
      _diyHeadNavigation(e) {
        // 是否为沉浸式
        if (!this.translucent) return
        // 是否自定义沉浸式方法
        if (this.hasTranslucentFn) {
          this.$emit('headNavigation', e)
          return
        }
        // 沉浸式滚动时的效果
        if (e.scrollTop >= this.hasTranslucentHeight) {
          this.headStyleData = 'background: rgba(255, 255, 255, 1)'
          this.titleColorData = '#000000'
          this.translucentTitle = this.title
        } else {
          this.headStyleData = 'background: rgba(255, 255, 255, 0)'
          this.titleColorData = 'white'
          this.translucentTitle = ''
        }
      },
      _initHeadStyle() {
        if (this.translucent) {
          this.headStyleData = 'background: rgba(255, 255, 255, 0)'
          this.titleColorData = 'transparent'
          this.translucentTitle = ''
        }
      },
      goBackUrl() {
        // 如果有自定义方法，会向父级页面传递一个customFn的方法，如果没有直接返回
        if (this.custom) {
          this.$emit('customFn')
          return
        }
        let pages = getCurrentPages()
        if (+pages.length === 1) {
          wx.switchTab({url: DEFAULT_PAGE})
        } else {
          wx.navigateBack({delta: 1})
        }
      },
      _exceedHeadShow(e) {
        if (this.exceedHeightFn) return
        // 沉浸式滚动时的效果
        if (e.scrollTop >= this.exceedHeight) {
          this.showTitle = false
        } else {
          this.showTitle = true
        }
      },
      setTranslucentTitle(title) {
        if (this.translucentTitle === title) return
        this.translucentTitle = title
      }
    },
    computed: {
      currentTitle() {
        if (this.translucentTitle.length > this.titleMaxLen) {
          return this.translucentTitle.slice(0, this.titleMaxLen) + '···'
        } else {
          return this.translucentTitle
        }
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  .head-item
    position: fixed
    width: 100vw
    transition: all 0.3s
    left: 0
    top: 0
    z-index: 100

    .head-arrow
      position: absolute
      left: 0
      bottom: 0
      height: 100%
      width: 40px
      display: flex
      align-items: center

      &:after
        content: ''
        position: absolute
        width: 100%
        height: 100%
        padding: 12px 20px

      .head-arrow-img
        display: block
        margin-left: 5px
        width: 18px
        height: @width

    .head-content
      position: relative
      text-align: center
      line-height: 44px
      height: 44px
      font-size: 18px
      font-family: PingFangSC-Medium
      color: #000000
  .showNavigation
    opacity: 0
</style>
