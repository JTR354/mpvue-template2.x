```html
<template>
  <div class="poster-wrapper canvas-item" id="share-goods">
    <div class="background-box">
      <img :src="imageUrl + '/exchange-image/share/pic-shopbg01@2x.png'" class="bg-img canvas-item">
    </div>
    <div class="info-goods-box canvas-item">
      <div class="info-goods">
        <div v-for="(item, index) in shareItem.goods" :key="index" :id="'goods-'+index" class="info-goods-item">
          <img :src="item.url" alt="" class="info-item-left canvas-item" mode="aspectFill">
          <div class="info-item-right">
            <div class="item-right-title canvas-item" :data-innerText="item.name">{{item.name}}</div>
            <div class="price-number-line">
              <i class="line-through canvas-item"></i>
              <div class="money-line">{{item.oldPrice}}</div>
              <div class="money-line-box canvas-item" :data-innerText="item.oldPrice"></div>
            </div>
            <div class="price-box">
              <div class="price-icon canvas-item" data-innerText="¥">¥</div>
              <div class="price-number canvas-item" :data-innerText="item.price">{{item.price}} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info-box">
      <div class="info-box-left">
        <div class="info-left-shop canvas-item" :data-innerText="shareItem.shopName">{{shareItem.shopName}}</div>
        <img :src="imageUrl + '/exchange-image/share/icon-comment@2x.png'" class="shop-img canvas-item">
        <div class="shop-address canvas-item" :data-innerText="shareItem.address">{{shareItem.address}}</div>
      </div>
      <div class="info-box-right">
        <div class="code-img-box">
          <img v-if="shareItem.shareQRCode" :src="shareItem.shareQRCode" class="code-img canvas-item">
        </div>
        <div class="code-text canvas-item" data-innerText="长按识别">长按识别</div>
        <div class="code-text-more canvas-item" data-innerText="享更多优惠">享更多优惠</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'goods-modal',
    props: {
      shareItem: {
        type: Object,
        default: {}
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .poster-wrapper
    position: fixed
    top: 43%
    transform :translateY(-50%)
    left: 0
    right: 0
    margin: auto
    background: #fff
    padding: px-change-vw(42) px-change-vw(15) px-change-vw(10)
    width: px-change-vw(300)
    border-radius: 6px
    box-sizing: border-box
    overflow: hidden
    z-index: 9999
    -webkit-transition: all .5s
    transition: all .5s
    .poster
      width: 100%
      height: 100%
    .background-box
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: px-change-vw(300)
      height: px-change-vw(446)
      .bg-img
        width: px-change-vw(300)
        height: px-change-vw(200)
        display: block
    .info-goods-box
      width: px-change-vw(270)
      height: px-change-vw(275)
      box-shadow: 0 1px 8px 0 rgba(0,0,0,0.06)
      margin: 0 auto 29rpx
      background: #fff
    .info-goods
      width: px-change-vw(270)
      max-height: px-change-vw(275)
      padding: px-change-vw(2.5) px-change-vw(10) 0
      background: #fff
      box-sizing: border-box
      display: flex
      flex-wrap: wrap
      .info-goods-item
        width: px-change-vw(120)
        padding-top: px-change-vw(7.5)
        layout(row)
        .info-item-left
          display: block
          width: px-change-vw(58)
          height: @width
          margin-right: 8rpx
        .info-item-right
          flex: 1
          max-height: px-change-vw(58)
          display: block
          .item-right-title
            font-bold()
            font-size: $font-size-11
            color: #1F1F1F
            margin-bottom: 15rpx
            width: 100%
            word-break: break-all
          .price-number-line
            font-family: $font-family-regular
            color: #979BA5
            font-size: 8px
            position :relative
            display :inline-block
            line-height: 8px

            .money-line
              font-family: $font-family-regular
              color: #979BA5
              font-size: 8px
              line-height: 8px
            .money-line-box
              position :absolute
              top: 0
              left: 0
              height :8px
              width : px2vw(54)
              display :block
              font-family: $font-family-regular
              color: #979BA5
              font-size: 8px
              line-height: 8px
            .line-through
              col-center()
              height : 1px
              width :100%
              background: #979BA5
          .price-box
            layout(row)
            align-items: flex-end
            .price-icon
              font-bold()
              color: #FF4500
              font-size: 9px
            .price-number
              font-bold()
              color: #FF4500
              font-size: $font-size-13
              flex: 1
      .info-goods-item:nth-of-type(odd)
        margin-right: px-change-vw(10)
    .info-box
      layout(row)
      align-items: center
      justify-content: space-between
      .info-box-left
        padding-top: 7rpx
        .info-left-shop
          font-family: $font-family-regular
          color: #2b2f37
          font-size: $font-size-12
          margin-bottom: 10rpx
        .shop-img
          width: 99rpx
          height: 17rpx
          display: block
          margin-bottom: 14rpx
        .shop-address
          font-family: $font-family-regular
          color: #979ba5
          font-size: $font-size-10
          width: px-change-vw(141)
      .info-box-right
        padding-top: 7rpx
        .code-img-box
          width: px-change-vw(63)
          height: @width
          margin: 0 auto 12rpx
          .code-img
            width: 100%
            height: 100%
            display: block
        .code-text
          font-family: $font-family-regular
          color: #979ba5
          font-size: $font-size-10
          text-align: center
          margin-bottom: 6rpx
        .code-text-more
          font-family: $font-family-regular
          color: #979ba5
          font-size: $font-size-10
          text-align: center
</style>
```

``` js
// 自动选择class为canvas-item 的元素
import HappyPoster from '@components/happy-poster/happy-poster'

const options = {
    els: [
      {
        el: '.canvas-item'
      }
    ]
  }

function _draw() {
        this.$refs.poster.exec(options, {
          getFilePath: (data) => {
            this.filePath = data
            this.$wechat.hideLoading()
            // wx.previewImage({
            //   current: '', // 当前显示图片的http链接
            //   urls: [data] // 需要预览的图片http链接列表
            // })
            let self = this
            let shareData = this.shareItem
            this.$wx.saveImageToPhotosAlbum({
              filePath: data,
              success: () => {
                this.$wechat.hideLoading()
                this._hideShareModal()
                this.actionDataCollect(shareData.event_no)
                wx.showToast({ title: '已保存到相册', icon: 'success' })
              },
              fail: (e) => {
                this.$wechat.hideLoading()
                // 没有授权，重新调起授权
                self.$wx.showModal({
                  content: '保存海报需进行相册授权，请到小程序设置中打开授权',
                  confirmText: '去授权',
                  confirmColor: '#73C200',
                  success(res) {
                    if (res.confirm) {
                      self.$wx.openSetting({
                        success: (res) => {
                          if (res.authSetting && res.authSetting['scope.writePhotosAlbum']) {
                            data && self._draw(data)
                          }
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        })
      }

```