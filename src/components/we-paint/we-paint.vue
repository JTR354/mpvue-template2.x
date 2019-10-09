<template>
  <div>
    <canvas
      class="canvas"
      v-if="canvasId"
      :canvas-id="canvasId"
      :style="canvasStyle"></canvas>
  </div>
</template>

<script type="text/ecmascript-6">
  import Selector from './src/selector'
  import WePaint from './src/main'
  import * as wechat from './utils/wechat'

  export default {
    data() {
      return {
        canvasStyle: '',
        panelW: 0,
        panelH: 0,
        multiple: 1,
        paint: null,
        canvasId: null,
        ctx: null
      }
    },
    methods: {
      // 接口
      async action(options) {
        let selectOptions = await this._selectorElements(options)
        let imgOptions = await this._getImgArrInfoHandle(selectOptions)
        this._init(imgOptions)
      },
      // 初始化
      _init(options) {
        this.canvasId = options.canvasId
        this.multiple = options.multiple
        this._initPanel(options, (paint, options) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              paint.drawElements(options.els)
              this._canvasDraw()
              resolve()
            }, 380)
          })
        })
      },
      // 初始化画布
      _initPanel(options, callback) {
        if (options.panel.el) {
          const query = Selector.createSelectorQuery()
          Selector.select(query, options.panel.el)
          Selector.exec(query, res => {
            this.panelH = res[0].height
            this.panelW = res[0].width
            // 设置画布大小
            this.canvasStyle = `width: ${100 * this.multiple}vw;height: ${this.panelH / this.panelW * 100 * this.multiple}vw;transform: scale(${1 / this.multiple})`
            options.panel = res[0] // 重置画板信息
            this.paint = new WePaint(options)
            this.ctx = this.paint.ctx
            callback && callback(this.paint, options)
          })
        } else {
          this.panelH = options.panel.height
          this.panelW = options.panel.width
          // 设置画布大小
          this.canvasStyle = `width: ${100 * this.multiple}vw;height: ${this.panelH / this.panelW * 100 * this.multiple}vw;transform: scale(${1 / this.multiple})`
          this.paint = new WePaint(options)
          this.ctx = this.paint.ctx
          callback && callback(this.paint, options)
        }
      },
      // 选择元素
      _selectorElements(options) {
        const els = options.els
        const query = Selector.createSelectorQuery()
        // 筛选需要选择的元素
        els.forEach((item) => {
          if (item.el && !item.isSelectAll) {
            Selector.select(query, item.el)
          } else if (item.el && item.isSelectAll) {
            Selector.selectAll(query, item.el)
          }
        })
        return new Promise((resolve, reject) => {
          // 获取选择的元素信息
          Selector.exec(query, res => {
            let index = 0
            let arr = []
            els.map((item) => {
              if (item.el) {
                if (res[index] == null) {
                  throw new Error('你选的元素不存在')
                }
                // 扁平化同类元素信息
                if (res[index].length) {
                  res[index].forEach((it, idx) => {
                    arr.push({ ...item, ...it, source: item.sourceArr[idx] })
                  })
                } else {
                  arr.push({ ...item, ...res[index] })
                }
                index++
              } else {
                arr.push(item)
              }
            })
            options.els = arr
            resolve(options)
          })
        })
      },
      // 下载图片
      _loadImageHandle(options) {
        const els = options.els
        let arr = []
        // 筛选需要下载的图片
        els.forEach((item) => {
          if (item.drawType === 'img' && !item.unLoad) {
            arr.push(item.source)
          }
        })
        return new Promise((resolve, reject) => {
          this._downloadPictures(arr, res => {
            let index = 0
            let loadArr = []
            // 重置图片为临时路径
            els.forEach((item) => {
              if (item.drawType === 'img' && !item.unLoad) {
                item.source = res[index].tempFilePath
                index++
              }
              loadArr.push(item)
            })
            options.els = loadArr
            resolve(options)
          })
        })
      },
      // 获取图片信息
      async _getImgArrInfoHandle(options) {
        let imgOptions = await this._loadImageHandle(options)
        let els = imgOptions.els
        let arr = []
        // 筛选需要裁剪的图片
        els.forEach((item) => {
          if (item.drawType === 'img' && item.mode) {
            arr.push(item.source)
          }
        })
        return new Promise((resolve, reject) => {
          this._getImgArrInfo(arr, res => {
            let index = 0
            let infoArr = []
            // 增加需要裁剪图片的源信息
            els.forEach((item) => {
              if (item.drawType === 'img' && item.mode) {
                item.imgInfo = res[index].imgInfo
                index++
              }
              infoArr.push(item)
            })
            imgOptions.els = els
            resolve(imgOptions)
          })
        })
      },
      /**
       * 下载图片
       * @param arr 图片路径
       * @param callback 回调函数
       * @returns {*}
       * @private
       */
      _downloadPictures(arr, callback) {
        wechat.showLoading()
        let flag = arr.every(val => val)
        if (!flag) {
          wechat.hideLoading()
          this.$emit('downloadFile', '图片数组为空', arr)
          return
          // return this.$refs.toast.show('下载图片失败，请重新尝试')
        }
        let ImgArr = arr.map(item => {
          return wechat.downloadFile({ url: item })
        })
        Promise.all(ImgArr).then(res => {
          callback && callback(res)
        }).catch((err) => {
          wechat.hideLoading()
          this.$emit('downloadFile', err)
          // this.$refs.toast.show('下载图片失败，请重新尝试！')
        })
      },
      /**
       * 获取动态评论的图片信息
       * @param arr
       * @param callback
       * @private
       */
      _getImgArrInfo(arr, callback) {
        let newArr = []
        let infoArr = arr.map(item => {
          return wechat.getImageInfo({ src: item })
        })
        Promise.all(infoArr).then((res) => {
          arr.map((item, index) => {
            newArr.push({ imgInfo: res[index] })
          })
          callback(newArr)
        }).catch((err) => {
          // console.error(err)
          this.$emit('getImageInfo', err)
        })
      },
      /**
       * canvas绘图
       * @private
       */
      _canvasDraw() {
        const ctx = this.ctx
        wechat.draw(ctx).then(res => {
          setTimeout(() => {
            this._canvasToFile(ctx)
          }, 380)
        }).catch((err) => {
          wechat.hideLoading()
          this.$emit('draw', err)
          // this.$refs.toast.show('绘图失败，请重新尝试！')
        })
      },
      /**
       * 导出canvas绘图
       * @param ctx 上下文
       * @private
       */
      _canvasToFile(ctx) {
        wechat.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: this.panelW * this.multiple,
          height: this.panelH * this.multiple,
          destWidth: this.panelW * 3,
          destHeight: this.panelH * 3,
          canvasId: this.canvasId,
          fileType: 'jpg'
        }, ctx).then(res => {
          wechat.hideLoading()
          wechat.previewImage({ urls: [res.tempFilePath] })
          this.$emit('drawDone', res.tempFilePath)
        }).catch(err => {
          this.$emit('canvasToTempFilePath', err)
          wechat.hideLoading()
          // this.$refs.toast.show('请重新尝试！')
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .canvas
    position :fixed
    left: -200vw
    opacity :0
    top:0
</style>
