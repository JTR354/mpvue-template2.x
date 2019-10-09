const appJson = require('../../../src/app.json')
const MAIN_PACKAGE = 'main'
const choices = []
if (appJson.subPackages && appJson.subPackages.length > 0) {
  appJson.subPackages.forEach((item) => {
    const packageName = item.root.replace(/\//g, '')
    item.pages.unshift('' + packageName)
    choices.push({message: packageName, value: item.pages})
  })
}
appJson.pages.unshift(MAIN_PACKAGE)
choices.unshift({message: MAIN_PACKAGE, value: appJson.pages})

module.exports = [
  {
    type: 'select',
    name: 'package',
    message: '请选择包名',
    choices
  },
  {
    type: 'input',
    name: 'name',
    message: '文件名:',
    validate(value) {
      if (!value.length) {
        return '文件名不能为空！'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'title',
    message: '标题:',
    validate(value) {
      if (!value.length) {
        return '页面标题不能为空！'
      }
      return true
    }
  }
]
