var chalk = require('chalk')
// var applications = require('./applications') // 应用
// var environments = require('./environments') // 环境
// var versions = require('./versions') // 版本
var applications = require('../config/applications') // 应用
var environments = require('../config/environments') // 环境
var versions = require('../config/versions') // 版本

function handleResolveArgs(arguments) {
  let res = {
    versions: '\'\'',
    applications: '\'platform\'',
    environments: '\'production\''
  }
  arguments.forEach(item => {
    setConfig(versions, item, res, 'versions')
    setConfig(applications, item, res, 'applications')
    setConfig(environments, item, res, 'environments')
  })
  return res
}

function setConfig(targetArr, target, res, key) {
  let result = targetArr.find(child => child === target)
  if (result) {
    switch (key) {
      case 'versions':
        res[key] = '\'/' + result + '\''
        break
      case 'applications':
        res[key] = '\'' + result + '\''
        break
      case 'environments':
        res[key] = '\'' + result + '\''
        break
      default:
        break
    }
  }
}
module.exports = handleResolveArgs
function handleException(message) {
  console.log(chalk.red('' + message + '\n'))
  process.exit(1)
}

