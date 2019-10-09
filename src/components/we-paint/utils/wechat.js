import wx from './wx'

export function showLoading (title = '加载中') {
  if (wx.showLoading) {
    wx.showLoading({
      title: title,
      mask: true
    })
  } else {
    wx.showNavigationBarLoading()
  }
}

export function hideLoading () {
  if (wx.hideLoading) {
    wx.hideLoading()
  } else {
    wx.hideNavigationBarLoading()
  }
}

/**
 * 弹出提示框
 */

export function tipSuccess (title, duration = 500) {
  wx.showToast({
    title: title,
    image: '/static/img/icon-global_success@2x.png',
    mask: true,
    duration: duration
  })
  if (duration > 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, duration)
    })
  }
}

/**
 * 选择照片
 * @returns {Promise<any>}
 */
export function chooseImage (data = {count: 1, sizeType: ['original', 'compressed'], sourceType: ['album', 'camera']}) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      ...data,
      // count, // 默认9
      // sizeType, // 可以指定是原图还是压缩图，默认二者都有 ['original', 'compressed']
      // sourceType, // 可以指定来源是相册还是相机，默认二者都有 ['album', 'camera']
      success: resolve,
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 选择预览图片
 * @returns {Promise<any>}
 */
export function previewImage (data = {urls: [], current: ''}) {
  return new Promise((resolve, reject) => {
    wx.previewImage({
      ...data,
      // current, // 当前显示图片的http链接
      // urls, // 需要预览的图片http链接列表
      success: resolve,
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 保存图片到系统相册
 * @returns {Promise<any>}
 */
export function saveImageToPhotosAlbum (data = {filePath: ''}) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      ...data,
      success: resolve,
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 获取图片信息，倘若为网络图片，需先配置download域名才能生效。
 * @returns {Promise<any>}
 */
export function getImageInfo (data = {src: ''}) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      ...data,
      success: resolve,
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 下载文件
 * @returns {Promise<any>}
 */
export function downloadFile (data = {url: ''}) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      ...data,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
 * @returns {Promise<any>}
 */
export function canvasToTempFilePath (data, ctx) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      ...data,
      success: resolve,
      fail: reject
    }, ctx)
  })
}

/**
 * canvasContext.draw 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
 * @returns {Promise<any>}
 */
export function draw (ctx, reserve = false) {
  return new Promise((resolve, reject) => {
    ctx.draw(reserve, (res) => {
      if (res.errMsg === 'drawCanvas:ok') {
        resolve(res)
      } else {
        reject(res)
      }
    })
  })
}
