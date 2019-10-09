import wx from 'wx'

export function login () {
  return new Promise((resolve, reject) => {
    wx.login({success: resolve, fail: reject})
  })
}

export function getUserInfo () {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({success: resolve, fail: reject})
  })
}

export function setStorage (key, value) {
  return new Promise((resolve, reject) => {
    wx.setStorage({key: key, data: value, success: resolve, fail: reject})
  })
}

export function getStorage (key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({key: key, success: resolve, fail: reject})
  })
}

export function getLocation (type = 'gcj02', callback) {
  return new Promise((resolve, reject) => {
    wx.getLocation({type: type, success: resolve, fail: reject, complete: callback})
  })
}

export function openLocation(data) {
  return new Promise((resolve, reject) => {
    wx.openLocation({...data, success: resolve, fail: reject})
  })
}

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
 * 微信页面滚动
 * @param scrollTop
 * @param duration
 */
export function pageScrollTo (scrollTop = 0, duration = 0) {
  wx.pageScrollTo({
    scrollTop,
    duration
  })
}

/**
 * 设置系统剪贴板的内容
 * @param data
 * @returns {Promise<any>}
 */
export function setClipboardData (data) {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({data: data, success: resolve, fail: reject})
  })
}

/**
 * 获取系统剪贴板内容
 * @returns {Promise<any>}
 */
export function getClipboardData () {
  return new Promise((resolve, reject) => {
    wx.getClipboardData({success: resolve, fail: reject})
  })
}

export function makePhoneCall (data) {
  return new Promise((resolve, reject) => {
    wx.makePhoneCall({phoneNumber: data, success: resolve, fail: reject})
  })
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
        setTimeout(() => {
          wx.openSetting()
        }, 1000)
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
 * 获取设备信息
 * @returns {Promise<any>}
 */
export function getSystemInfo() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 全局toast
 * @returns {Promise<any>}
 */
export function showToast(title, duration = 1500, mask = true, icon = 'none') {
  if (!title) return
  wx.showToast({title, icon, duration, mask})
}

// 检查登录态是否过期。
export function checkSession () {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: resolve,
      fail: reject
    })
  })
}
