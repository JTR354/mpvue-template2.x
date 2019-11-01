# {{ project }}

> {{ description }}

## Build Setup


``` bash
# 初始化项目
zanbo-cli init

# 安装依赖
npm run install

# 修复百度小程序
npm run fix:swan

- tips:
 组合命令：npm run i:fix

# 开发时构建
npm run start env=dev pla=wx ver=1.0.0 app=platfrom

# 打包构建
npm run build env=dev pla=wx ver=1.0.0 app=platfrom

- tips:
   versions     => ver（版本）    默认值：''           其他值：任意
   applications => app（应用）    默认值：'platform'   其他值：任意 
   environments => env（环境）    默认值：'production' 其他值：test测试 dev研发
   platforms    => pla（平台）    默认值：'wx'         其他值：swan百度 tt字节
   id           => id （小程序id）默认值：''           其他值：任意 

# 三端同时开发(微信、百度、头条)
npm run start:dev 研发
npm run start:test 测试
npm run start:prod 生成

# 三端同时打包构建(微信、百度、头条)
npm run build:dev 研发
npm run build:test 测试
npm run build:prod 生成

# 生成 bundle 分析报告
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 构建优化

> 字节跳动小程序在形式上支持分包加载，实现多端统一的效果

# hygen 创建page改动

```bash
# 创建页面
npm run new page
# 创建分包
npm run new package
# 创建组件
npm run new component
# 创建vuex公共模块
npm run new module
# 创建utls工具
npm run new util
# 创建api工具
npm run new api

```

###### tips： 
> 使用npm run new 创建 page时，自动写入了modules文件,需要去除state中todo属性，改vuex才会自动加载至store中

```js
export const state = {
  todo: true // 待删除
}

export const getters = {}

export const mutations = {}

export const actions = {}

```

# 路由常量池：
> 页面跳转路由请用路由常量 【this.$pages.页面路径】；方便迁移H5项目！！！
```js
mpvue.navigateTo({url: this.$pages.hello})
```

# mixins
- mixins/base-common.js放置mpvue相关  
- mixins/base.js放置项目相关
```js
  // mixins/base-common.js文件
  // this.timer && clearInterval(this.timer)
  // typeof this._beforeUnload === 'function' && this._beforeUnload()
  // 增加_beforeUnload钩子函数一般用来清除定时器（页面卸载前；默认会清除this.timer）
```

# 首页异步方案
> 解决全局数据异步的问题：即当某个页面需要等待APP全局请求回数据后再执行改页面的方法
```js
// App.vue文件 单例模式只能条用一次
AppPromise.getInstance(resolve => {     // eslint-disable-line
  console.log('mock： ===> app on show 延迟5s!!!==mpvuePlatform=>', mpvuePlatform)
  setTimeout(() => {
    resolve(true)
  }, 5000)
})
// 其他页面相应的生命周期类 各个页面的各函数内可以多次调用
AppPromise.getInstance().then(res => {
  this.launch()
})
```

# http工具 使用说明

> 请查看[README_HTTP_HELP.md](./README_HTTP_HELP.md)

# 目录结构
- api 接口
- assets 图片资源
- components 组件
- design 样式
- mixins 全局混入
- pages 页面
- state 全局vuex模块
- utils 工具类
- static 静态资源

# 其他提示
- slot不支持使用