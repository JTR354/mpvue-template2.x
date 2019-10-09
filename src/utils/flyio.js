// 微信小程序入口
import _Fly from 'flyio/dist/npm/fly'
import EngineWrapper from 'flyio/dist/npm/engine-wrapper'
const wxEngine = EngineWrapper(adapter)

function adapter(request, responseCallback) {
  let con = {
    method: request.method,
    url: request.url,
    dataType: request.dataType || undefined,
    header: request.headers,
    data: request.body || {},
    responseType: request.responseType || 'text',
    success(res) {
      responseCallback({
        statusCode: res.statusCode,
        responseText: res.data,
        headers: res.header,
        statusMessage: res.errMsg
      })
    },
    fail(res) {
      responseCallback({
        statusCode: res.statusCode || 0,
        statusMessage: res.errMsg
      })
    }
  }
  mpvue.request(con)
}

export default function (engine) {
  return new _Fly(engine || wxEngine)
}
