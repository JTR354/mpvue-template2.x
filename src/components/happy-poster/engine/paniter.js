// 设置画布大小
// 计算偏移量
export default class Painter {
  constructor(options) {
    this.panel = {...options.panel}
    this.canvas = options.canvas
    this.ctx = options.ctx
    this.systemInfo = wx.getSystemInfoSync()
  }
  init() {
    this._setCanvasSize()
  }
  get canvasInfo() {
    return {
      width: this.canvasWidth,
      height: this.canvasHeight,
      canvas: this.canvas,
      ctx: this.ctx
    }
  }
  _setCanvasSize() {
    const {panel, canvas, ctx, systemInfo} = this
    const {height, width} = panel
    let {windowWidth, pixelRatio} = systemInfo
    const targetWidth = windowWidth
    const targetHeight = height / width * targetWidth
    if (!/ios/ig.test(systemInfo)) {
      pixelRatio = 2
    }
    canvas.width = targetWidth * pixelRatio
    canvas.height = targetHeight * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)
    this.canvasDpr = targetWidth / width
    this.canvasWidth = targetWidth
    this.canvasHeight = targetHeight
  }
  canvasToTempFilePath() {
    return new Promise((resolve, reject) => {
      const {width, height} = this.canvasInfo
      const {canvas} = this
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width,
        height,
        destWidth: width * 4,
        destHeight: height * 4,
        fileType: 'jpg',
        quality: 1,
        canvas,
        success: resolve,
        fail: reject
      })
    })
  }
  destroy() {
    if (this.systemInfo && this.ctx) {
      const dpr = 1 / this.systemInfo.pixelRatio
      this.ctx.scale(dpr, dpr)
    }
    this.canvas = null
    this.ctx = null
    this.systemInfo = null
    this.canvasWidth = null
    this.canvasHeight = null
    this.canvasDpr = null
  }
  drawExec(elements) {
    elements.forEach((el, index) => {
      el = this.reviseDrawData(el)
      if (el.Image) {
        this.drawImage(el)
      } else if (el.dataset.innertext) {
        this.drawText(el)
      } else {
        this.drawRect(el)
      }
    })
  }
  // 调整绘图数据
  reviseDrawData(el) {
    const {canvasDpr, panel} = this
    const originLeft = panel.left
    const originTop = panel.top
    el.top = (el.top - originTop) * canvasDpr
    el.left = (el.left - originLeft) * canvasDpr
    el.width *= canvasDpr
    el.height *= canvasDpr
    // 处理阴影
    if (el.boxShadow !== 'none') {
      try {
        const shadows = el.boxShadow.replace(/, /g, ',').split(' ')
        el.shadowInfo = {
          shadowColor: shadows[0],
          shadowOffsetX: this.reviseUnit(shadows[1]),
          shadowOffsetY: this.reviseUnit(shadows[2]),
          shadowBlur: this.reviseUnit(shadows[3])
        }
      } catch (e) {
        console.error(e)
      }
    }
    // 处理文本
    if (el.dataset.innertext) {
      el.fontSize = this.reviseUnit(el.fontSize)
    }
    return el
  }
  // 转换单位
  reviseUnit(unit) {
    const {systemInfo, canvasDpr} = this
    const {windowWidth} = systemInfo
    if (/px/.test(unit)) {
      return unit.replace('px', '') * canvasDpr
    }
    if (/rpx/.test(unit)) {
      return unit.replace('px', '') / 2 * canvasDpr
    }
    if (/vw/.test(unit)) {
      return unit.replace('px', '') / 100 * windowWidth * canvasDpr
    }
    return unit
  }
  // 裁切圆形
  drawClip(el, callback) {
    const {ctx} = this
    const { top, left, width } = el
    let r = width / 2
    let x = r + left
    let y = r + top
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#ffffff'
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.clip()
    callback && callback()
    ctx.restore()
  }
  // 绘制图片
  drawImage(el) {
    if (/%$/.test(el.borderRadius)) {
      this.drawClip(el, () => {
        this.drawImageDefault(el)
      })
    } else {
      this.drawImageDefault(el)
    }
  }
  drawImageDefault(el) {
    const {ctx} = this
    let { Image, top, left, width, height, mode } = el
    let x = left
    let y = top
    let w = width
    let h = height
    if (!mode) {
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = '#ffffff'
      ctx.drawImage(Image, x, y, w, h)
      ctx.restore()
      return
    }
    let sW = Image.width
    let sH = Image.height
    let sWH = sW / sH
    let nx, ny, nw, nh
    switch (mode) {
      case 'aspectFill': {
        if ((w <= h && sW <= sH) || (w > h && sW <= sH)) {
          nw = w
          nh = nw / sWH
          ny = y - (nh - h) / 2
          nx = x
        } else {
          nh = h
          nw = nh * sWH
          nx = x - (nw - w) / 2
          ny = y
        }
        break
      }
      case 'widthFix': {
        nw = w
        nh = nw / sWH
        ny = y
        nx = x
        break
      }
      default:
        break
    }
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#ffffff'
    ctx.moveTo(x, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x + w, y)
    ctx.lineTo(x + w, y + h)
    ctx.lineTo(x, y + h)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(Image, nx, ny, nw, nh)
    ctx.restore()
  }
  // 绘制矩形
  drawRect(el) {
    const {ctx} = this
    const {backgroundColor, left, top, width, height, shadowInfo} = el
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = backgroundColor
    if (shadowInfo) {
      ctx.shadowColor = shadowInfo.shadowColor
      ctx.shadowOffsetX = shadowInfo.shadowOffsetX
      ctx.shadowOffsetY = shadowInfo.shadowOffsetY
      ctx.shadowBlur = shadowInfo.shadowBlur
    }
    ctx.fillRect(left, top, width, height)
    ctx.restore()
  }
  drawText(el) {
    const {ctx} = this
    let {color, fontSize, textAlign, fontWeight, fontFamily} = el
    ctx.save()
    ctx.beginPath()
    ctx.textBaseline = 'top'
    ctx.fillStyle = color
    ctx.textAlign = textAlign
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    this._drawTextMeasure(el)
    ctx.restore()
  }
  _drawTextMeasure(el) {
    const {ctx} = this
    const {dataset, top, left, width, height, fontSize, textAlign} = el
    const lineHeight = 1
    const metrics = ctx.measureText(dataset.innertext)
    let leftWithTextAlign = left
    if (textAlign === 'center') {
      leftWithTextAlign = left + width / 2
    } else if (textAlign === 'right') {
      leftWithTextAlign = left + width
    }
    const fontHeight = fontSize
    if (metrics.width > width) {
      let innerTextArray = createMeasureTextArray(ctx, dataset.innertext, width)
      for (let i = 0; i < innerTextArray.length; i++) {
        let text = innerTextArray[i]
        const lineTop = top + i * fontHeight * lineHeight
        text && ctx.fillText(text, leftWithTextAlign, lineTop, width)
      }
    } else {
      const lineTop = top + (height - fontHeight) / 2
      dataset.innertext && ctx.fillText(dataset.innertext, leftWithTextAlign, lineTop)
    }
  }
}

function createMeasureTextArray(ctx, string, width) {
  const array = []
  let lineText = ''
  let lineLength = 0
  for (let i = 0; i < string.length; i++) {
    const char = string.charAt(i)
    const charWidth = ctx.measureText(char).width
    lineLength += charWidth
    if (lineLength < width) {
      lineText += char
    } else {
      array.push(lineText)
      lineText = ''
      lineLength = 0
      lineText += char
      lineLength += charWidth
    }
  }
  if (lineText) {
    array.push(lineText)
  }
  return array
}