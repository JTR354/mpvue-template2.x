import Fly from './flyio'

function HTTP () {
  this.http = new Fly()
  this.callback = {}
  this.get = function (args) {
    return this._formatRequestData(args, {method: 'GET'})
  }
  this.post = function(args) {
    return this._formatRequestData(args, {method: 'POST'})
  }
  this.put = function(args) {
    return this._formatRequestData(args, {method: 'PUT'})
  }
  this.delete = function(args) {
    return this._formatRequestData(args, {method: 'DELETE'})
  }
  this._formatRequestData = function(args, {method}) {
    const {url, data} = args
    if (typeof this.callback.beforeRequest === 'function') {
      this.callback.beforeRequest(args)
    }
    return this.http.request(url, data, {
      method
    }).then((response) => {
      return checkStatus(response)
    }).then(res => {
      if (typeof this.callback.responseFulfilled === 'function') {
        return this.callback.responseFulfilled(res, args)
      } else {
        return res
      }
    })
  }
  // 设置回调函数
  this.setCallback = function(callback) {
    this.callback = {...this.callback, ...callback}
  }
  // 设置头部信息
  this.setHeaders = function(args = {}) {
    for (let key in args) {
      this.http.config.headers[key] = args[key]
    }
  }
  // 初始化函数
  this.init = function(fn) {
    fn && fn(this.http)
  }
}

HTTP.getInstance = function() {
  if (!this.instance) {
    this.instance = new HTTP()
  }
  return this.instance
}

// 检查http状态码
function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status < 400)) {
    return response.data || {}
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    message: '网络开小差'
  }
}

export default HTTP.getInstance()
