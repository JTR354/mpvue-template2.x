import COS from './libs/cos-wx-sdk-v5'
import Upload from './api-upload'
import { ERR_OK } from '@utils/config'
import { fileType } from './fileConfig'

const SIGN_ERROR = 1
const CHOICE_ERROR = 2
const UPLOAD_ERROR = 3
const SAVE_ERROR = 4

const {IMAGE_TYPE, VIDEO_TYPE} = fileType

/**
 * 实例COS
 */
let cos = new COS({
  getAuthorization: function (params, callback) {
    Upload.getUploadSign().then((res) => {
      console.log(res, 222)
      if (res.error !== ERR_OK) {
        throw new Error(res)
      }
      callback(res.data.sign)
    }).catch((err) => {
      if (err) {
        throw handleException(SIGN_ERROR)
      }
    })
  }
})

/**
 * 选择文件
 * @param fileType 文件类型
 * @param showProcess 展示进度条回调方法
 * @param processCallBack 进度条回调方法
 * @param count 选择数量
 * @returns {Promise}
 */
export default function chooseFiles(fileType = IMAGE_TYPE, count = 9, showProcess, processCallBack) {
  return new Promise((resolve, reject) => {
    fileController(fileType, count).then((filePaths) => {
      showProcess && showProcess()
      let type = fileType === VIDEO_TYPE ? 'video' : 'image'
      let requests = filePaths.map((filePath) => {
        return Upload.getUploadParam().then((res) => {
          console.log(res, 111)
          if (res.error !== ERR_OK) {
            throw new Error(res)
          }
          const data = res.data
          if (data) {
            let params = reorganizeParams(data, filePath, processCallBack)
            return postObject(params, type)
          }
        }).catch((err) => {
          if (err) {
            reject(handleException(UPLOAD_ERROR))
          }
        })
      })
      Promise.all(requests).then((res) => {
        resolve(res)
      }).catch((err) => {
        if (err) {
          reject(err)
        }
      })
    })
  })
}

/**
 * 跳过选择图片的操作，直接上传
 * @param fileType 文件类型
 * @param filePaths 文件路径
 * @param showProcess 展示进度条方法
 * @param processCallBack 进度条回调方法
 * @returns {Promise<any>}
 */
export function uploadFiles(fileType, filePaths, showProcess, processCallBack) {
  return new Promise((resolve, reject) => {
    showProcess && showProcess()
    let type = fileType === VIDEO_TYPE ? 'video' : 'image'
    let requests = filePaths.map((filePath) => {
      return Upload.getUploadParam().then((res) => {
        if (res.error !== ERR_OK) {
          throw new Error(res)
        }
        const data = res.data
        if (data) {
          let params = reorganizeParams(data, filePath, processCallBack)
          return postObject(params, type)
        }
      }).catch((err) => {
        if (err) {
          reject(handleException(UPLOAD_ERROR))
        }
      })
    })
    Promise.all(requests).then((res) => {
      resolve(res)
    }).catch((err) => {
      if (err) {
        reject(err)
      }
    })
  })
}

/**
 * @param type 文件类型
 * @param count 选择数量
 * @returns {Promise}
 */
function fileController(type, count) {
  return new Promise((resolve, reject) => {
    switch (type) {
      case IMAGE_TYPE:
        wx.chooseImage({
          count, // 用户自己选择
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            resolve(res.tempFilePaths)
          },
          fail: function () {
            reject(handleException(CHOICE_ERROR))
          }
        })
        break
      case VIDEO_TYPE:
        wx.chooseVideo({
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          compressed: true, // 可以指定视频文件压不压缩
          success: function (res) {
            resolve([res.tempFilePath])
          },
          fail: function () {
            reject(handleException(CHOICE_ERROR))
          }
        })
        break
      default:
        break
    }
  })
}

/**
 * 抽象上传数据工具类
 * @param params 上传参数
 * @param fileType 上传文件类型（入库用到）
 * @returns {Promise}
 */
function postObject(params, fileType) {
  return new Promise((resolve, reject) => {
    cos.postObject(params, function (err, data) {
      if (!err && data.statusCode === 200) {
        Upload.saveFile({path: `/${params.Key}`, file_type: fileType || ''}).then(files => {
          // Todo 隐藏加载器
          if (files.error === ERR_OK) {
            resolve(files.data)
          } else {
            reject(handleException(SAVE_ERROR))
          }
        }).catch(err => {
          if (err) {
            // Todo 隐藏加载器
            reject(handleException(SAVE_ERROR))
          }
        })
      } else {
        reject(handleException(UPLOAD_ERROR))
      }
    })
  })
}

/**
 * 整理数据工具类
 * @param data 签名回调数据
 * @param filepath 文件路径
 * @param callback 进度条回调函数
 * @returns {{Bucket: *, Region: *, Key: *, FilePath: *, onProgress: onProgress}}
 */
function reorganizeParams(data, filepath, callback) {
  const {path, bucket, region} = data
  let suffix = getSuffix(filepath)
  let key = path + suffix
  const params = {
    Bucket: bucket,
    Region: region,
    Key: key,
    FilePath: filepath,
    onProgress: function (info) {
      if (callback && typeof callback === 'function') {
        callback(info)
      }
    }
  }
  return params
}

/**
 * 获取后缀名字符串
 * @param path 文件名及路径
 * @returns {string}
 */
function getSuffix(path) {
  let dotIndex = path.lastIndexOf('.')
  let length = path.length
  return path.substring(dotIndex, length)
}

/**
 * 处理异常
 * @param type 异常类型
 * @returns {*}
 */
function handleException(type) {
  switch (type) {
    case SIGN_ERROR:
      return new Error('签名失败')
    case UPLOAD_ERROR:
      return new Error('上传失败')
    case SAVE_ERROR:
      return new Error('入库失败')
    case CHOICE_ERROR:
      return new Error('选择失败')
    default:
      return new Error('系统异常')
  }
}
