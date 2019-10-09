# mpvue性能优化

## 一. 常规优化

### 1. 图片压缩[tiny](https://tinypng.com/)
> 图片资料采用静态资源服务器
>> 小程序代码包经过编译后，会放在微信的 CDN 上供用户下载，CDN 开启了 GZIP 压缩，所以用户下载的是压缩后的 GZIP 包，其大小比代码包原体积会更小。 但是，不同小程序之间的代码包压缩比差异也挺大的，部分可以达到 30%，而部分只有 80%，而造成这部分差异的一个原因，就是图片资源的使用。GZIP 对基于文本资源的压缩效果最好，在压缩较大文件时往往可高达 70%-80% 的压缩率，而如果对已经压缩的资源（例如大多数的图片格式）则效果甚微。
- 图片资源
> 目前图片资源的主要性能问题在于大图片和长列表图片上，这两种情况都有可能导致 iOS 客户端内存占用上升，从而触发系统回收小程序页面。
- 图片对内存的影响
> 在 iOS 上，小程序的页面是由多个 WKWebView 组成的，在系统内存紧张时，会回收掉一部分 WKWebView。大图片和长列表图片的使用会引起 WKWebView 的回收。
- 图片对页面切换的影响
> 除了内存问题外，大图片也会造成页面切换的卡顿。有一部分小程序会在页面中引用大图片，在页面后退切换中会出现掉帧卡顿的情况。
>>尽量减少使用大图片资源

### 2. 删除无用的库
> 尽可能的使用微信提供的组件以及api

### 3. 清除watchers
> mpvue每次打开页面都会添加一个监听器,所以在卸载页面的时候进行清除

```js
function _clearWatcher() {
  // 清除mpvue的wathcers
  this._watchers = []
  this._watcher && this._watcher.teardown()
}
```

4. 清理页面数据
> mpvue基于vue改造,在onUnload生命周期后不执行destroy导致data数据不会重置,可使用该方法进行清理

```js
function _resetData() {
  // 重置页面组件的data数据
  if (!this.$mp) return
  // 重置页面的data数据
  let flag = unResetPage.some(value => {
    let reg = new RegExp(value)
    return reg.test(this.$options.__file)
  })
  if (!flag && this.$options.data) {
    Object.assign(this.$data, this.$options.data())
  }
}
```

## 二. 小程序优化

- [官方优化建议](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips.html)

### 1. 开启Vue.config._mpTrace = true 性能检测工具
> [mpvue页面刷新机制全面升级](https://github.com/mpvue/blog/issues/2)
```js
Vue.config._mpTrace = process.env !== 'production'
Vue.config.productionTip = false
App.mpType = 'app'
```
> 改属性,可以在控制台看到每500更新的数据量,如图: 

![](https://upload-images.jianshu.io/upload_images/4709762-3516ab242ad2febe?imageMogr2/auto-orient/strip%7CimageView2/2/w/546)

> 如果数据更新量很大,会明显感觉到小程序运行卡顿,反之流畅  
> 注意:生成环境要关闭此功能!

### 2. data()中只放需要的数据
```js
import xx from 'xx.js'
export default {
    data () {
        this.hello = 'world'
        return {
            xx,
            otherXX: '2'
        }
    }
}
```

> 非页面渲染的数据添加在data中会增加监听的成本
> 注意vuex中state数据同理,尽量减少它的数据量,即vuex存的数据要尽可能少
- 善用storage,可以用storage缓解内存的紧张
> 小程序的storage支持单个 key允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB.    
> 所以可以将一些相对取用不频繁的数据放进storage中，需要时再将这些数据放进内存，从而缓解内存的紧张，有点类似Windows中虚拟内存的概念。
### 3. 精简data

> 过滤掉api返回的冗余数据  
>> 后台返回api可能存在一些冗余的数据而页面是用不到的,比如返回一个列表字段很多;若将整个返回的数据设置到data中增加了vue的监听成本.  
>> 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。  
   小程序的内存是很宝贵的，当articleList数据量非常大超过1M时，某些机型就会爆掉

> 可以配合本次优化的http工具在formatter参数中进行处理

```js
API.Jwt.getToken({
  data,
  formatter(res) {
    return {id: res.id}
  },
  doctor(res, url) {
  }
}).then(res => {
  console.log(res) // {id: 'xxx', ....}
})

```
> 当然，如果你的需求中是所有数据都要用到（或者大部分数据），就没必要做一层精简了，收益不大。毕竟精简数据的函数中具体的字段，是会增加维护成本的。
做数据过滤虽然增加了维护的成本，但一般收益都很大，因次这个方法比较推荐。

### 4. Page.prototype.setData(Object data, Function callback) 

> 其中 key 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如 array[2].message，a.b.c.d，并且不需要在 this.data 中预先定义。
>> 注意:
 1. 直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致。
 2. 仅支持设置可 JSON 化的数据。
 3. 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
 4. 请不要把 data 中任何一项的 value 设为 undefined ，否则这一项将不被设置并可能遗留一些潜在问题。
```js
/**
* data: {
      text: 'init data',
      num: 0,
      array: [{text: 'init data'}],
      object: {
        text: 'init data'
      }
    },
*/
// 对于对象或数组字段，可以直接修改一个其下的子字段，这样做通常比修改整个对象或数组更好
this.setData({
  'array[0].text':'changed data'
})
```

### 5. onPageScroll(Object object)

> 注意：请只在需要的时候才在 page 中定义此方法，不要定义空方法。以减少不必要的事件派发对渲染层-逻辑层通信的影响。   
注意：请避免在 onPageScroll 中过于频繁的执行 setData 等引起逻辑层-渲染层通信的操作。尤其是每次传输大量数据，会影响通信耗时。

### 6. 动画优化
- [如果要使用动画，尽量用css动画代替wx.createAnimation](https://juejin.im/post/5c8509c05188257e16046d63#heading-14)
- 使用css动画时建议开启硬件加速
```css
/**
  will-change: auto;
  transform: translate3d(0, 0, 0);
*/
```
### 7. 定时器的清理
> 不要在data定义_timer定时器的变量,否则清除不掉

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  onUnload() {
    clearInterval(this._timer)
  },
  methods: {
    handle() {
      this._timer = setInterval(() => {
        this.count++
      }, 1000)
    }
  }
}
```

# 总结
- 压缩图片,使用远程静态资源服务器加载图片(image组件要添加mode)
- 控制图片的大小,包括后台返回的图片
- 处理冗余的data数据
- 尽量不使用onPageScroll
- 采用css动画
- 定时器的处理,clearWatch,还原页面数据等
