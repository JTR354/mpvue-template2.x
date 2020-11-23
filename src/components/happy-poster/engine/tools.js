export function getCanvas(id) {
  if (!id) {
    throw new Error('Tools getCanvas error 未传入canvas id：' + id)
  }
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    query
      .select(id)
      .fields({
        node: true
      })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          throw new Error('getCanvas 未找到canvas:' + id)
        }
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        resolve({canvas, ctx})
      })
  })
}

export function mergeImage(elements, elementsWithImages) {
  let arr = elements.map((item, index) => {
    const el = elementsWithImages.find(v => v.src === item.src)
    if (el && el.Image) {
      item.Image = el.Image
    }
    return item
  })
  return arr
}

export function loadImage(canvas, elements, regExp) {
  const arr = []
  elements.forEach((item) => {
    if (item.src) {
      const promise = new Promise(async (resolve, reject) => {
        const image = canvas.createImage()
        let imageSrc = item.src
        if (regExp && new RegExp(regExp).test(item.src)) {
          imageSrc = await new Promise((resolve, reject) => {
            wx.downloadFile({
              url: item.src, // 仅为示例，并非真实的资源
              success (res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                  resolve(res.tempFilePath)
                }
              }
            })
          })
        }
        image.src = imageSrc
        image.onload = function () {
          resolve(image)
        }
        image.onerror = function () {
          resolve(null)
        }
      })
      arr.push(promise)
    }
  })
  return Promise.all(arr).then(res => {
    let index = 0
    return elements.map((item) => {
      if (item.src) {
        item.Image = res[index]
        index++
      }
      return item
    })
  })
}

export function base64ToSrc(base64data) {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'))
    }
    const filePath = `${wx.env.USER_DATA_PATH}/tmp_base64src${Date.now()}.${format}`
    wx.getFileSystemManager().writeFile({
      filePath,
      data: bodyData,
      encoding: 'base64',
      success() {
        resolve(filePath)
      },
      fail(err) {
        console.error(err)
        reject(new Error('ERROR_BASE64SRC_WRITE'))
      }
    })
  })
}

export function removeSavedFile({filePath}) {
  if (!filePath) {
    throw new Error('poster tools error removeSavedFile 请传入需要删除的文件路径 (本地路径)')
  }
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().unlink({
      filePath,
      success: resolve,
      fail(err) {
        console.error(err)
        reject(err)
      }
    })
  })
}