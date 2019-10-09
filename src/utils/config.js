const env = process.env
const version = process.versions

const DEV = {
  api: 'http://social-shopping-api.jerryf.cn/social-shopping' + version,
  image: 'https://img.jerryf.cn/defaults',
  upload: 'http://social-shopping-api.jerryf.cn/social-shopping' + version,
  outLink: 'wss://fresh-h5.jkweixin.net', // 外部h5链接
  websocket: 'wss://wss.jerryf.cn/',
  webview: 'https://fresh-h5.jkweixin.net'
}

const TEST = {
  api: 'https://social-shopping-api.jkweixin.net/social-shopping' + version,
  image: 'https://img.jkweixin.net/defaults',
  upload: 'https://social-shopping-api.jkweixin.net/social-shopping' + version,
  outLink: 'https://fresh-h5.jkweixin.net',
  websocket: 'wss://wss.jkweixin.net',
  webview: 'https://fresh-h5.jkweixin.net'
}

const PROD = {
  api: 'https://social-shopping-api.jkweixin.com/social-shopping' + version,
  image: 'https://img.jkweixin.com/defaults',
  upload: 'https://social-shopping-api.jkweixin.com/social-shopping' + version,
  outLink: 'https://fresh-h5.jkweixin.com',
  websocket: 'wss://wss.jkweixin.com',
  webview: 'https://fresh-h5.jkweixin.com'
}

export const baseURL = env === 'production' ? PROD : env === 'test' ? TEST : DEV

export const ERR_OK = 0
export const TIME_OUT = 10000
export const ERR_NO = -404
export const TOKEN_OUT = 10000 // token 失效
