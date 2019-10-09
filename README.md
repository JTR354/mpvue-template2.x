# {{ project }}

> {{ description }}

## Build Setup

``` bash
# 初始化项目
vue init mpvue/mpvue-quickstart myproject
cd myproject

# 安装依赖
yarn

# 开发时构建
npm dev

# 打包构建
npm build

# 指定平台的开发时构建(微信、百度、头条、支付宝)
npm start:wx (dev v1) 环境 版本
npm start:swan
npm start:tt
npm start:my

# 指定平台的打包构建
npm build:wx
npm build:swan
npm build:tt
npm build:my

# 生成 bundle 分析报告
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# hygen 创建page改动

1. 使用npm run new 创建 page时，自动写入了modules文件,需要去除state中todo属性，改vuex才会自动加载至store中

```js
export const state = {
  todo: true // 待删除
}

export const getters = {}

export const mutations = {}

export const actions = {}

```

# http 改动

> 请查看utils/http-help.md
