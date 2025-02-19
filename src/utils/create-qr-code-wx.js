import wx from 'wx'
const fsm = wx.getFileSystemManager()
const FILE_BASE_NAME = 'tmp_base64src'

const base64src = function(base64data) {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'))
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME + Date.now()}.${format}`
    const buffer = wx.base64ToArrayBuffer(bodyData)
    // console.log(typeof buffer)
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath)
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'))
      }
    })
  })
}

export function bufferToImage(buffer) {
  return new Promise((resolve, reject) => {
    const format = 'png'
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME + Date.now()}.${format}`
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath)
      },
      fail() {
        reject(new Error('ERROR_BUFFER_WRITE'))
      }
    })
  })
}
export default base64src
