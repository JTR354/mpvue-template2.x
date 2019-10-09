export default function () {
  const self = this
  const {ctx, multiple, rPos} = self
  /**
   * 绘制图片
   * @param imgUrl  图片路径
   * @param res 盒子信息
   * @param xAdjust 可调整的偏移量x轴
   * @param yAdjust 可调整的偏移量y轴
   * @private
   */
  self.PaintFigure.drawImg = (item) => {
    let { source, top, left, width, height, xAdjust = 0, yAdjust = 0, mode, imgInfo, color = '#fff' } = item
    if (!source) return
    let x = (left + rPos.left + xAdjust) * multiple
    let y = (top + rPos.top + yAdjust) * multiple
    let w = width * multiple
    let h = height * multiple
    if (!mode) {
      ctx.drawImage(source, x, y, w, h)
      return
    }
    if (imgInfo) {
      source = imgInfo.path
    }
    let sW = imgInfo.width
    let sH = imgInfo.height
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
    ctx.setStrokeStyle(color)
    ctx.setFillStyle(color)
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
    ctx.drawImage(source, nx, ny, nw, nh)
    ctx.restore()
  }

  self.PaintFigure.drawImgShadow = (item) => {
    let offsetX = item.shadow[0] * multiple
    let offsetY = item.shadow[1] * multiple
    let blur = item.shadow[2] * multiple
    let color = item.shadow[3]
    let shadowBackground = item.shadow[4] || '#fff'
    ctx.save()
    ctx.beginPath()
    ctx.setFillStyle(shadowBackground)
    if (item.shape === 'circle') {
      self.PaintFigure.drawCircle(item)
    } else {
      self.PaintFigure.drawRect(item)
    }
    ctx.setShadow(offsetX, offsetY, blur, color)
    // 0 8px 16px 0 rgba(74, 144, 226, 0.15)
    ctx.fill()
    ctx.restore()
  }

  self.PaintFigure.drawImgClip = (item) => {
    let { shapeBg = '#fff' } = item
    ctx.save()
    ctx.beginPath()
    ctx.setFillStyle(shapeBg)
    if (item.shape === 'circle') {
      self.PaintFigure.drawCircle(item)
    } else {
      self.PaintFigure.drawRect(item)
    }
    // self.PaintFigure..setShadow(0, 0.5 * vw, 10, 'rgba(55,75,99,0.15)')
    ctx.clip()
    self.PaintFigure.drawImg(item)
    ctx.restore()
  }

  /**
   * 绘制圆形
   * @param r 半径
   * @param res 盒子的信息
   * @param xAdjust 可调整的偏移量x轴
   * @param yAdjust 可调整的偏移量y轴
   * @private
   */
  self.PaintFigure.drawCircle = (item) => {
    let { r, top, left, width, height, xAdjust = 0, padding = 0 } = item
    if (item.shadow) {
      padding = item.shadow[item.shadow.length - 1]
    }
    // r = (width / 2 + padding) * multiple
    r = (width / 2 + padding) * multiple
    let x = (left + rPos.left + width / 2 + xAdjust) * multiple
    let y = (top + rPos.top + height / 2 + xAdjust) * multiple
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
  }

  /**
   * 填充矩形
   * @param color
   * @param res
   * @param xAdjust
   * @param yAdjust
   */
  self.PaintFigure.drawRect = (item) => {
    let { color = '#fff', top, left, width, height, xAdjust = 0, yAdjust = 0 } = item
    let x = (left + rPos.left + xAdjust) * multiple
    let y = (top + rPos.top + yAdjust) * multiple
    let w = width * multiple
    let h = height * multiple
    ctx.save()
    ctx.beginPath()
    ctx.setFillStyle(color)
    ctx.fillRect(x, y, w, h)
    ctx.restore()
  }
  /**
   * 填充矩形阴影
   * @param color
   * @param res
   * @param xAdjust
   * @param yAdjust
   */
  self.PaintFigure.drawRectShadow = (item) => {
    let { color = '#fff', top, left, width, height, xAdjust = 0, yAdjust = 0 } = item
    let x = (left + rPos.left + xAdjust) * multiple
    let y = (top + rPos.top + yAdjust) * multiple
    let w = width * multiple
    let h = height * multiple
    let offsetX = item.shadow[0] * multiple
    let offsetY = item.shadow[1] * multiple
    let blur = item.shadow[2] * multiple
    let shadowColor = item.shadow[3]
    ctx.save()
    ctx.beginPath()
    ctx.setFillStyle(color)
    ctx.setShadow(offsetX, offsetY, blur, shadowColor)
    ctx.fillRect(x, y, w, h)
    ctx.restore()
  }
}
