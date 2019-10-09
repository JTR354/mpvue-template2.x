// import API from '@api'
// import * as wechat from './wechat'
// import {ERR_OK} from '@utils/config'
// import {SCENE_QR_CODE, SCENE_DEFAULT, SCENE_SHARE} from './contants'
// import $$routes from '@utils/routes'
//
// const shareArr = [1007, 1008, 1036, 1044, 1073, 1074]
// const qrCordArr = [1047, 1048, 1049, 1011, 1012, 1013]
//
// // 判定场景值 0普通 1分享 2扫码
// export function entryAppType(options) {
//   if (!options && options.scene) return SCENE_DEFAULT
//   let scene = +options.scene
//   let isShare = shareArr.includes(scene)
//   let isQrcord = qrCordArr.includes(scene)
//   let source = isShare ? SCENE_SHARE : isQrcord ? SCENE_QR_CODE : SCENE_DEFAULT
//   return source
// }
// /* 深度拷贝 */
// export function objDeepCopy(source) {
//   let sourceCopy = source instanceof Array ? [] : {}
//   for (let item in source) {
//     sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
//   }
//   return sourceCopy
// }
//
// /* 格式数字 */
// export function formatNumber(n) {
//   const str = n.toString()
//   return str[1] ? str : `0${str}`
// }
//
// /* 当前时间毫秒数 */
// export const now = Date.now()
//
// /* 格式化时间 */
// export function formatTime(date = now) {
//   date = new Date(date)
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()
//
//   const t1 = [year, month, day].map(formatNumber).join('/')
//   const t2 = [hour, minute, second].map(formatNumber).join(':')
//
//   return `${t1} ${t2}`
// }
//
// /* 行为记录时间处理 */
// export function actionTimeFormat(time) {
//   let resTime = new Date(time * 1000)
//   let nowDate = formatDateTime(resTime)
//   let nowTime = formatTime(resTime)
//   let todayTime = new Date()
//   let todayDate = formatDateTime(todayTime)
//   let yesToday = todayTime.setDate(todayTime.getDate() - 1)
//   let yesTodayDateTime = new Date(yesToday)
//   let yesTodayDate = formatDateTime(yesTodayDateTime)
//   nowDate = nowDate.replace(todayDate, '')
//   nowDate = nowDate.replace(yesTodayDate, '昨天').trim()
//   nowTime = nowTime.replace(todayDate, '')
//   nowTime = nowTime.replace(yesTodayDate, '昨天').trim()
//   return {
//     date: nowDate,
//     time: nowTime
//   }
// }
//
// export function formatDateTime(time) {
//   let date = new Date(time)
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//
//   return [year, month, day].join('/')
// }
//
// /**
//  * 格式化时间
//  * @param date 时间
//  * @param str 连接符
//  * @returns {string}
//  */
// export function formatTimeYMD(date = now, str = '-') {
//   date = new Date(date)
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//
//   const t1 = [year, month, day].map(formatNumber).join(str)
//
//   return `${t1}`
// }
//
// /**
//  * 记录当前页面栈详细
//  */
// export function resolvePageDetail(url, options) {
//   // 拼接url的参数
//   let urlWithArgs = '/' + url + '?'
//   for (let key in options) {
//     let value = options[key]
//     if (value) {
//       urlWithArgs += key + '=' + value + '&'
//     }
//   }
//   urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
//   return urlWithArgs
// }
//
// /**
//  * 解析永久二维码参数
//  * @param scene
//  * @returns {{}}
//  */
// export function resolveQrCode(scene) {
//   if (!scene) {
//     return {}
//   }
//   let params = {}
//   let strs = scene.split('&')
//   for (let i = 0; i < strs.length; i++) {
//     params[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
//   }
//   return params
// }
//
// // 解析永久二维码参数
// export function getParams(scene) {
//   if (!scene) {
//     return {}
//   }
//   let params = {}
//   let strs = scene.split('&')
//   for (let i = 0; i < strs.length; i++) {
//     params[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
//   }
//   return params
// }
//
// // 解析url
// function getUrl(path = '', query = {}) {
//   let url = path
//   const TAB_REG = /(pages\/choiceness)|(pages\/shopping-cart)|(pages\/mine)/
//   let status = TAB_REG.test(path)
//   if (!status) {
//     let string = ''
//     for (let value in query) {
//       string = `&${value}=${query[value]}`
//     }
//     url = string ? `${url}?${string.slice(1)}` : url
//   }
//   return url
// }
//
// // 白名单
// const WHITE_LIST = ['pages/recommend', 'pages/coupon-take']
// // 凭证失效时重新调起接口请求获取登录
// export async function silentAuthorization() {
//   /* eslint-disable no-undef */
//   let el = await getCurrentPages()[getCurrentPages().length - 1]
//   let url = el && getUrl(el.route, el.options)
//   wx.setStorageSync('targetPage', url)
//   // 推广页面另外处理（白名单处理）
//   let flag = el && WHITE_LIST.some(val => val === el.route)
//   if (flag) {
//     return
//   }
//   let codeJson = await wechat.login()
//   let tokenJson = await API.Login.getToken({code: codeJson.code}, false)
//   if (tokenJson.error === ERR_OK) {
//     wx.setStorageSync('token', tokenJson.data.access_token)
//     wx.setStorageSync('userInfo', tokenJson.data.customer_info)
//     await getCurrentPages()[getCurrentPages().length - 1].onLoad()
//     await getCurrentPages()[getCurrentPages().length - 1].onShow()
//     return
//   }
//   wx.reLaunch({url: $$routes.main.LOGIN})
// }
//
// // 两个浮点数求和
// export function floatAccAdd(num1, num2) {
//   let r1, r2, m
//   try {
//     r1 = num1.toString().split('.')[1].length
//   } catch (e) {
//     r1 = 0
//   }
//   try {
//     r2 = num2.toString().split('.')[1].length
//   } catch (e) {
//     r2 = 0
//   }
//   m = Math.pow(10, Math.max(r1, r2))
//   // return (num1*m+num2*m)/m;
//   return Math.round(num1 * m + num2 * m) / m
// }
//
// /**
//  * 时分秒
//  * @param time 入参为秒
//  * @returns {{hour: string, differ: number, minute: string, second: string}}
//  */
// export function countDownHandle(time = 0) {
//   let differ = +time || 0
//   // let day = ~~(differ / 60 / 60 / 24) + ''
//   let hour = ~~(differ / 60 / 60) + ''
//   let minute = ~~(differ / 60 % 60) + ''
//   let second = differ % 60 + ''
//   // day = day.padStart(2, '0')
//   hour = hour.padStart(2, '0')
//   minute = minute.padStart(2, '0')
//   second = second.padStart(2, '0')
//   return {
//     // day,
//     hour,
//     minute,
//     second,
//     differ
//   }
// }
//
// /**
//  * 解析二维码-公共方法
//  */
// export function resolveQueryScene(scene = '') {
//   let goodsId = 0
//   let shopId = 0
//   let activityId = 0
//   let marketId = 0
//   let employeeId = 0
//   if (scene) {
//     try {
//       let sceneMsg = decodeURIComponent(scene)
//       const params = getParams(sceneMsg)
//       shopId = +params.shopId || +params.s || 0
//       goodsId = +params.id || +params.g || 0
//       activityId = +params.activityId || +params.a || 0
//       marketId = +params.marketId || +params.m || 0
//       employeeId = +params.employeeId || +params.e || 0
//     } catch (e) {
//       console.error(e)
//     }
//   }
//   return {
//     shopId,
//     goodsId,
//     activityId,
//     marketId,
//     employeeId
//   }
// }
//
// // 优惠券金额处理
// export function formatCouponMoney (money = '') {
//   const arr = ('' + money).split('.')
//   return {
//     int: arr[0],
//     dec: +arr[1] ? '.' + arr[1] : ''
//   }
// }
//
// // 判断是否为空对象
// export function isEmptyObject(obj = {}) {
//   for (let key in obj) {
//     return false // 返回false，不为空对象
//   }
//   return true // 返回true，为空对象
// }
