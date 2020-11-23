import Selector from './selector'
import * as Tools from './tools'
import Paniter from './paniter'

let time = Date.now() // eslint-disable-line
function log(flag) {
  process.env === 'test' && console.log(flag, Date.now() - time)
  // console.log(flag, Date.now() - time)
  time = Date.now()
}
// const systemInfo = wx.getSystemInfoSync()
// console.log(systemInfo)
export default class HappyPoster {
  constructor(options) {
    this.options = options
    this.painter = null
  }
  static async logImage(options) {
    log('logImage---------------------start')
    const id = options.id
    if (!id) {
      throw new Error('未找到canvas id')
    }
    const selectors = await Selector(options.els).catch(err => console.error(err))
    log('logImage-------selectors--------------end')
    const {canvas} = await Tools.getCanvas(id).catch(err => console.error(err))
    log('logImage-------canvas--------------end')
    const elements = await Tools.loadImage(canvas, selectors, options.useRegExpDownloadFile).catch(err => console.error(err))
    log('logImage---------------------end')
    return elements
  }
  static async removeSavedFile(filePath) {
    try {
      await Tools.removeSavedFile({filePath})
    } catch (e) {
      console.error(e, 'poster index error removeSavedFile')
    }
  }
  get canvasInfo() {
    if (this.painter) {
      throw new Error('poster index error painter.canvasInfo is null')
    }
    return this.painter.canvasInfo
  }
  async exec({methods = {}, elementsWithImages, callbackEnd, callbackGetCanvasInfo}) {
    const {options} = this
    log('start---------------------')
    const id = options.id
    if (!id) {
      throw new Error('未找到canvas id')
    }
    // 选择元素
    let selectors = await Selector(options.els).catch(err => console.error(err))
    log('selector---------------------')
    // 获取canvas
    const {canvas, ctx} = await Tools.getCanvas(id).catch(err => console.error(err))
    // console.log(selectors)
    // console.log(ctx)
    // console.log(selectors)
    log('获取canvas---------------------')
    // 实例化画家
    this.painter = new Paniter({panel: selectors[0], canvas, ctx})
    // 设置画布大小
    this.painter.init()
    if (typeof callbackGetCanvasInfo === 'function') {
      await callbackGetCanvasInfo(this.painter.canvasInfo)
    }
    this.selectors = selectors
    this.canvas = canvas
    if (typeof methods.getCanvasInfo === 'function') {
      await methods.getCanvasInfo(this.painter.canvasInfo)
    }
    log('设置画布大小---------------------')
    // 下载图片
    let elements = {}
    if (elementsWithImages && elementsWithImages.pop && elementsWithImages.length) {
      elements = Tools.mergeImage(this.selectors, elementsWithImages)
    } else {
      elements = await Tools.loadImage(this.canvas, this.selectors, options.useRegExpDownloadFile).catch(err => console.error(err))
    }
    log('下载图片---------------------')
    // 画图
    this.painter.drawExec(elements)
    log('画图---------------------')
    let imageBase64
    if (typeof methods.getImageBase64 === 'function') {
      imageBase64 = this.canvas.toDataURL('image/jpeg', 1)
      log('imageBase64---------------------')
      await methods.getImageBase64(imageBase64)
    }
    let filePath = ''
    if (typeof methods.getFilePath === 'function') {
      // if (!imageBase64) {
      //   imageBase64 = canvas.toDataURL('image/jpeg', 1)
      //   log('imageBase64---------------------')
      // }
      // let filePath = await Tools.base64ToSrc(imageBase64).catch(err => console.error(err))
      const res = await this.painter.canvasToTempFilePath()
      filePath = res.tempFilePath
      log('filePath---------------------')
      methods.getFilePath(filePath)
    }
    if (typeof callbackEnd === 'function') {
      await callbackEnd()
    }
  }
  destroy() {
    this.painter && this.painter.destroy()
    this.options = null
    this.painter = null
  }
}