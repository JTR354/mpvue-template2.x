var chalk = require('chalk')
var path = require('path')
var fs = require('fs')
var data = ''
try {
  data = fs.readFileSync(path.join(__dirname, './_microtask.js'), 'utf-8')
  fs.writeFileSync(path.join(__dirname,  '../../node_modules/core-js/library/modules/_microtask.js'), data)
} catch (e) {
  console.error(e)
}
try {
  // data = fs.readFileSync(path.join(__dirname, './_mp-compiler.js'), 'utf-8')
  // fs.writeFileSync(path.join(__dirname,  '../../node_modules/mpvue-loader/lib/mp-compiler/index.js'), data)
} catch (e) {
  console.error(e)
}
console.log(chalk.green(
  '  Tip: fix swan Success!'
))