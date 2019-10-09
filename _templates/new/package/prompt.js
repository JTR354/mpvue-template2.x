const appJson = require('../../../src/app.json')
const MAIN_PACKAGE = 'main'

module.exports = [
  {
    type: 'input',
    name: 'packageName',
    message: '请输入分包名称:',
    validate(value) {
      if (!value.length) {
        return '分包名不能为空！'
      }
      if (/(-|_|\n|\s|\+|=)/g.test(value)) {
        return '分包名称不能使用-_+=等连词'
      }
      if (appJson.subPackages && appJson.subPackages.length > 0) {
        let flag = appJson.subPackages.some((item) => {
          let reg = new RegExp(value)
          return reg.test(item.root) || MAIN_PACKAGE === value
        })
        if (flag) {
          return '分包名不能重复'
        }
      }
      return true
    }
  }
]
