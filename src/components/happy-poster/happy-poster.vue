<template>
  <canvas v-if="isShowCanvas" type="2d" :id="canvasId" :style="styles" class="happy-poster"></canvas>
</template>

<script type="text/ecmascript-6">
  import HappyPoster from './engine'
  const COMPONENT_NAME = 'HAPPY_POSTER'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        styles: '',
        elementsWithImages: [],
        isShowCanvas: true
      }
    },
    computed: {
      canvasId() {
        return `myCanvas${this._uid}`
      }
    },
    onReady() {
      setTimeout(() => {
        this.$emit('onReady')
      }, 100)
    },
    onUnload() {
      this.styles = ''
      this.elementsWithImages = []
      this.isShowCanvas = true
    },
    methods: {
      async removeSavedFile(filePath) {
        if (!filePath) return
        await HappyPoster.removeSavedFile(filePath).catch(e => null)
      },
      async loadImage(options) {
        options = this._initOptions(options)
        try {
          this.elementsWithImages = await HappyPoster.logImage(options)
          return true
        } catch (e) {
          console.error(e, 'happy-poster-component error 加载图片失')
        }
      },
      async exec(options, methods) {
        if (!this.__systemInfo__) {
          this.__systemInfo__ = wx.getSystemInfoSync()
        }
        if (/ios/ig.test(this.__systemInfo__.system) && !this.styles) {
          await this._doExec(options).catch(e => console.error(e))
        }
        await this._doExec(options, methods).catch(e => console.error(e))
      },
      async _doExec(options, methods) {
        options = this._initOptions(options)
        const happyPoster = new HappyPoster(options)
        let data = {
          methods,
          elementsWithImages: this.elementsWithImages,
          callbackEnd: this._resetCanvas,
          callbackGetCanvasInfo: this._setCanvasStyles
        }
        await happyPoster.exec(data)
      },
      _setCanvasStyles({width, height}) {
        this.styles = `width:${width}px;height:${height}px;`
      },
      _resetCanvas() {
        return new Promise(resolve => {
          this.isShowCanvas = false
          setTimeout(() => {
            this.isShowCanvas = true
            resolve()
          }, 100)
        })
      },
      _initOptions(options) {
        if (!options) {
          throw new Error('happy-poster-component error 请传入配置文件')
        }
        options.id = '#' + this.canvasId
        options.useRegExpDownloadFile = `common/file/qrcode/miniprogram-load`
        return options
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .happy-poster
    position :fixed
    left :-100vw
    top: 0
    opacity : 0
</style>
