require('./check-versions')()

process.env.NODE_ENV = 'production'
process.env.PLATFORM = process.argv[2] || 'wx'
var getParams = require('./build.utils')

let params = getParams(process.argv)
process.env.BUILD_ENV = params.environments
process.env.VERSION = params.versions
process.env.APPLICATION = params.applications
console.log(Object.assign(params, {platform: process.env.PLATFORM}))

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')
var utils = require('./utils')

var spinner = ora(`building for ${process.env.BUILD_ENV}...`)
spinner.start()

rm(path.join(config.build.assetsRoot, '*'), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    if (process.env.PLATFORM === 'swan') {
      utils.writeFrameworkinfo()
    }
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
