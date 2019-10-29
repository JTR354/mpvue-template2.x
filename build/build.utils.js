// var chalk = require('chalk')
// // var applications = require('./applications') // 应用
// // var environments = require('./environments') // 环境
// // var versions = require('./versions') // 版本
// var applications = require('../config/applications') // 应用
// var environments = require('../config/environments') // 环境
// var versions = require('../config/versions') // 版本
// var platforms = require('../config/platforms') // 版本
//
// function handleResolveArgs(arguments) {
//   let res = {
//     versions: '\'\'',
//     applications: '\'platform\'',
//     environments: '\'production\'',
//     platforms : 'wx'
//   }
//   arguments.forEach(item => {
//     setConfig(versions, item, res, 'versions')
//     setConfig(applications, item, res, 'applications')
//     setConfig(environments, item, res, 'environments')
//     setConfig(platforms, item, res, 'platforms')
//   })
//   return res
// }
//
// function setConfig(targetArr, target, res, key) {
//   let result = targetArr.find(child => child === target)
//   if (result) {
//     switch (key) {
//       case 'versions':
//         res[key] = '\'/' + result + '\''
//         break
//       case 'applications':
//         res[key] = '\'' + result + '\''
//         break
//       case 'environments':
//         res[key] = '\'' + result + '\''
//         break
//       case 'platforms' :
//         res[key] = result
//         break
//       default:
//         break
//     }
//   }
// }
// module.exports = handleResolveArgs
// function handleException(message) {
//   console.log(chalk.red('' + message + '\n'))
//   process.exit(1)
// }

const argv = process.argv.slice(2)
const params = {}
argv.forEach((a) => {
  const arr = a.split("=")
  params[arr[0]] = arr[1]
})
module.exports = {
  versions: params.ver || '',
  applications: params.app || 'platform',
  environments: params.env || 'production',
  platforms: params.pla || 'wx',
  [params.pla + 'Id']: params.id
}