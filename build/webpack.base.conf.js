var path = require('path')
var fs = require('fs')
var utils = require('./utils')
var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var vueLoaderConfig = require('./vue-loader.conf')
var MpvuePlugin = require('webpack-mpvue-asset-plugin')
var glob = require('glob')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var relative = require('relative')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// function getEntry (rootSrc) {
//   var map = {};
//   glob.sync(rootSrc + '/pages/**/main.js')
//   .forEach(file => {
//     var key = relative(rootSrc, file).replace('.js', '');
//     map[key] = file;
//   })
//    return map;
// }
//
// const appEntry = { app: resolve('./src/main.js') }
// const pagesEntry = getEntry(resolve('./src'), 'pages/**/main.js')
// const entry = Object.assign({}, appEntry, pagesEntry)

function getEntry (rootSrc, pattern, packageType) {
  let files = glob.sync(path.resolve(rootSrc, pattern))
  return files.reduce((res, file) => {
    let info = path.parse(file)
    let dirname = info.dir.slice(rootSrc.length + 1)
    let dirnames = dirname.split('/')
    let key = getKey(dirnames, packageType).join('/')
    res[key] = path.resolve(file)
    return res
  }, {})
}
function getKey(dirnames, packageType) {
  switch (packageType) {
    case "main":
      return [dirnames[0], dirnames[2]]
    case "sub":
      return [dirnames[1], dirnames[2]]
    default:
      return []
  }
}
const appEntry = { app: resolve('./src/main.js') }
const pagesEntry = getEntry(resolve('./src'), 'pages/main/**/config.js', 'main')
const packageEntry = getEntry(resolve('./src'), 'pages/package*/**/config.js', 'sub')
const entry = Object.assign({}, appEntry, pagesEntry, packageEntry)

var env = process.env.BUILD_ENV
var versions = process.env.VERSION
var applications = process.env.APPLICATION
var DEFINE_PLUGIN = {
  'mpvue': 'global.mpvue',
  'wx': 'global.mpvue',
  'mpvuePlatform': JSON.stringify(process.env.PLATFORM),
  'process.env': env,
  'process.applications': applications,
  'process.versions': versions
}
if (process.env.PLATFORM === 'wx') {
  delete DEFINE_PLUGIN.wx
}

let baseWebpackConfig = {
  // 如果要自定义生成的 dist 目录里面的文件路径，
  // 可以将 entry 写成 {'toPath': 'fromPath'} 的形式，
  // toPath 为相对于 dist 的路径, 例：index/demo，则生成的文件地址为 dist/index/demo.js
  entry,
  target: require('mpvue-webpack-target'),
  output: {
    path: config.build.assetsRoot,
    jsonpFunction: 'webpackJsonpMpvue',
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue': 'mpvue',
      'wx': resolve('src/utils/wx'),
      '@': resolve('.'),
      '@src': resolve('src'),
      '@api': resolve('src/api'),
      '@assets': resolve('src/assets'),
      '@design': resolve('src/design/index.styl'),
      '@style':resolve('src/design/'),
      '@state': resolve('src/state'),
      '@mixins': resolve('src/mixins'),
      '@pages': resolve('src/pages'),
      '@utils': resolve('src/utils'),
      '@components': resolve('src/components'),
      '@flyio': 'flyio/dist/npm/wx'
    },
    symlinks: false,
    aliasFields: ['mpvue', 'weapp', 'browser'],
    mainFields: ['browser', 'module', 'main']
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'mpvue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        include: [resolve('src'), resolve('test')],
        use: [
          'babel-loader',
          {
            loader: 'mpvue-loader',
            options: Object.assign({checkMPEntry: true}, vueLoaderConfig)
          },
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    // api 统一桥协议方案
    new webpack.DefinePlugin(DEFINE_PLUGIN),
    new MpvuePlugin(),
    new CopyWebpackPlugin([{
      from: 'src/app.json',
      to: '',
      transform(content, path) {
        return utils.optimizeAppJson(content, path)
      }
    }]),
    new CopyWebpackPlugin([
      {
        from: 'src/pages/**/*.json',
        to: 'pages/[name].json',
        transformPath(targetPath, absolutePath) {
          return utils.pathHandle(targetPath, absolutePath)
        }
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(config.build.assetsRoot, './static'),
        ignore: ['.*']
      }
    ]),
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static/custom-tab-bar'),
    //     to: path.resolve(config.build.assetsRoot, config.build.assetsSubDirectoryTabBar),
    //     ignore: ['.*']
    //   }
    // ])
  ]
}

// 针对百度小程序，由于不支持通过 miniprogramRoot 进行自定义构建完的文件的根路径
// 所以需要将项目根路径下面的 project.swan.json 拷贝到构建目录
// 然后百度开发者工具将 dist/swan 作为项目根目录打
const projectConfigMap = {
  tt: '../project.config.json',
  swan: '../project.swan.json'
}

const PLATFORM = process.env.PLATFORM
if (/^(swan)|(tt)$/.test(PLATFORM)) {
  baseWebpackConfig = merge(baseWebpackConfig, {
    plugins: [
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, projectConfigMap[PLATFORM]),
        to: path.resolve(config.build.assetsRoot)
      }])
    ]
  })
}

module.exports = baseWebpackConfig
