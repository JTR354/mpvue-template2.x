import request from '@utils/http'
import { baseURL } from '@utils/config'

export default {
  /**
   * 获取签名
   * @returns {Promise.<*>}
   */
  getUploadSign() {
    const url = `${baseURL.upload}/api/cos/upload-sign`
    const doctor = () => {}
    return request.get({url, doctor})
  },
  /**
   * 获取文件夹存储桶
   * @param data
   * @returns {Promise.<*>}
   */
  getUploadParam(data) {
    const url = `${baseURL.upload}/api/cos/upload-param`
    const doctor = () => {}
    return request.get({url, data, doctor})
  },
  /**
   * 数据入库
   * @param data
   * @returns {Promise.<*>}
   */
  saveFile(data) {
    const url = `${baseURL.upload}/api/cos/save-file`
    const doctor = () => {}
    return request.post({url, data, doctor})
  }
}
