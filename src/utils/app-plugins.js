import Vue from 'vue'
import store from '@state/store'
import {ERR_OK, baseURL} from './config'
import baseCommon from '@mixins/base-common'
import base from '@mixins/base'
import routes from '@utils/routes'
import wx from 'wx'

// 定义插件
const AppPlugin = {
  install: function () {
    Vue.mixin(base)
    Vue.mixin(baseCommon)
    Vue.prototype.$ERR_OK = ERR_OK
    Vue.prototype.$imageUrl = baseURL.image
    Vue.prototype.$store = store
    Vue.prototype.$routes = routes
  }
}
// 使用插件
Vue.use(AppPlugin)
wx.onNetworkStatusChange(function (res) {
  // console.error(res.isConnected, typeof res.isConnected, '是否有网络连接')
})
wx.onMemoryWarning(function (res) {
  console.warn('onMemoryWarningReceive', res)
})
