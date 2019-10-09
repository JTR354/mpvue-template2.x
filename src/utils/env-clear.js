import wx from 'wx'
import {baseURL} from '@utils/config'

export function envClear() {
  const env = process.env
  const currentEnv = wx.getStorageSync('env')
  if (env !== currentEnv && currentEnv) {
    wx.clearStorageSync()
    wx.setStorageSync('env', env)
  }
  console.warn('环境：' + env)
  console.warn('参数：', baseURL)
}

envClear()
