/**
 * 解决appOnShow到页面延迟的问题
 * app.vue --> onShow --> AppPromise.getInstance(resolve =>{ ... })
 * 首页.vue --> 生命周期 --> AppPromise.getInstance().then(res => ...)
 */

export default class AppPromise {
  static getInstance(task) {
    if (!this.instance) {
      this.instance = new AppPromise(task)
    }
    return this.instance
  }
  constructor(task) {
    this.status = 'pending'
    this.callback = []
    this.value = undefined
    const self = this
    function resolve(value) {
      if (self.status === 'pending') {
        self.status = 'fulfilled'
        self.value = value
        self.callback.forEach(fn => fn())
      }
    }
    try {
      task && task(resolve)
    } catch (e) {
      console.error(e)
    }
  }
  then(fn) {
    let self = this
    if (self.status === 'fulfilled') {
      fn(self.value)
    }
    if (self.status === 'pending') {
      self.callback.push(() => fn(self.value))
    }
  }
}
