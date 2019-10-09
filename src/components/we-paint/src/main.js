import wx from '../utils/wx'
import text from './text'
import figure from './figure'

class Paint {
  constructor(props) {
    let self = this
    Object.assign(self, props)
    self._init()
    self.PaintText()
    self.PaintFigure()
    return self
  }

  drawElements(els) {
    els.map((item) => {
      this._drawItem(item)
    })
  }

  _init() {
    if (!this.canvasId) {
      throw new Error(`canvasId is null`)
    }
    this.ctx = wx.createCanvasContext(this.canvasId)
    this.rPos = {left: 0 - this.panel.left, top: 0 - this.panel.top}
  }

  _drawItem(item) {
    switch (item.drawType) {
      case 'img': {
        this._drawItemImg(item)
        break
      }
      case 'text': {
        this.PaintText.drawText(item)
        break
      }
      case 'text-area': {
        this.PaintText.drawTextArea(item)
        break
      }
      case 'rect': {
        this.PaintFigure.drawRect(item)
        break
      }
      case 'rect-shadow': {
        this.PaintFigure.drawRectShadow(item)
        break
      }
      default:
        break
    }
  }

  _drawItemImg(item) {
    if (item.shadow && item.shape) {
      this.PaintFigure.drawImgShadow(item)
      this.PaintFigure.drawImgClip(item)
    } else if (item.shadow && !item.shape) {
      this.PaintFigure.drawImgShadow(item)
      this.PaintFigure.drawImg(item)
    } else if (!item.shadow && item.shape) {
      this.PaintFigure.drawImgClip(item)
    } else {
      this.PaintFigure.drawImg(item)
    }
  }
}

Paint.prototype.PaintText = text
Paint.prototype.PaintFigure = figure

export default Paint
