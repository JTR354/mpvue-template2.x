export default function () {
  const self = this
  const {ctx, multiple, rPos, panel} = self

  self.PaintText.drawText = (item) => {
    let {source, top, left, width, height, color, fontSize = 12, align = 'left', textBaseline = 'top', centerType = 'all', xAdjust = 0, yAdjust = 0} = item
    if (!source) return
    fontSize = multiple * fontSize
    ctx.save()
    ctx.beginPath()
    ctx.setTextBaseline(textBaseline)
    ctx.setFillStyle(color)
    ctx.setFontSize(fontSize)
    ctx.setTextAlign(align)
    let x = self.PaintText._textAlignX(align, centerType, xAdjust, left, top, width, height)
    let y = (top + rPos.top + yAdjust) * multiple
    ctx.fillText(source, x, y)
    ctx.restore()
  }

  /**
   * 绘制多行文本
   * @param text  文本内容
   * @param color 颜色
   * @param fontSize  字体大小
   * @param align 排列方式
   * @param res 盒子信息
   * @param textMargin  换行间距调整比例
   * @param textBaseline  文本基线
   * @param xAdjust 可调整的偏移量x轴
   * @param yAdjust 可调整的偏移量y轴
   * @private
   */
  self.PaintText.drawTextArea = (item) => {
    let {source, top, left, width, height, color, fontSize = 12, align = 'left', textBaseline = 'top', centerType = 'all', textMargin, xAdjust = 0, yAdjust = 0} = item
    if (!source) return
    fontSize = multiple * fontSize
    if (!textMargin) {
      switch (multiple) {
        case 1 :
          textMargin = 1.6
          break
        case 2 :
          textMargin = 0.8
          break
        case 3 :
          textMargin = 0.5
          break
        default :
          break
      }
    }
    ctx.save()
    ctx.beginPath()
    ctx.setTextBaseline(textBaseline)
    ctx.setFillStyle(color)
    ctx.setFontSize(fontSize)
    ctx.setTextAlign(align)
    // 匹配换行符
    let newArr = source.split(/\n|\r/g)
    // 分割数组中所有的文字
    let newTextArr = []
    newArr.forEach(item => {
      let newText = item
      if (item) {
        newText = self.PaintText._spliceTextLine(newText, {width, fontSize})
        newTextArr.push(...newText)
      } else {
        newTextArr.push('')
      }
    })
    // 开始绘制文字
    let baseY = top + rPos.top + yAdjust // 基础y轴位置
    newTextArr.forEach((item, index) => {
      ctx.setFontSize(fontSize)
      let y = (baseY + (index * fontSize * textMargin)) * multiple
      let x = self.PaintText._textAlignX(align, centerType, xAdjust, left, top, width, height)
      ctx.fillText(item, x, y)
    })
    ctx.restore()
  }

  /**
   * 文本对齐方式
   * @param align 排列方式
   * @param centerType 居中形式（相对画板居中，相对盒子居中）
   * @param xAdjust 可调整的偏移量x轴
   * @param res 盒子信息
   * @returns {number}
   * @private
   */
  self.PaintText._textAlignX = (align, centerType, xAdjust, left, top, width, height) => {
    let x = 0
    switch (align) {
      case 'center': {
        x = (panel.width + xAdjust) / 2 * multiple
        if (centerType !== 'all') {
          x = ((left + rPos.left) + width / 2 + xAdjust) * multiple
        }
        break
      }
      case 'left': {
        x = (left + rPos.left + xAdjust) * multiple
        break
      }
      default: {
        break
      }
    }
    return x
  }

  /**
   * canvas 每行的字
   * @param text 文本文件
   * @returns {Array} return每行文字的数组
   * @private
   */
  self.PaintText._spliceTextLine = (str, res) => {
    let arr = []
    let lineWidth = 0
    let lastSubStrIndex = 0 // 每次开始截取的字符串的索引
    let canvasWidth = res.width
    ctx.save()
    ctx.beginPath()
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width
      if (lineWidth > canvasWidth) {
        arr.push(str.substring(lastSubStrIndex, i))
        lineWidth = 0
        lastSubStrIndex = i
      }
      if (i === str.length - 1) { // 绘制剩余部分
        arr.push(str.substring(lastSubStrIndex, i + 1))
      }
    }
    ctx.restore()
    return arr
  }
}
