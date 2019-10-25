import Routes from '@utils/routes'
// 不需要自动重置data数据的页
const unResetPage = []

export default {
  data() {
    return {
      imageUrl: this.$imageUrl,
      $routes: Routes
    }
  },
  onLoad() {
  },
  onUnload() {
    this.timer && clearInterval(this.timer)
    typeof this._beforeUnload === 'function' && this._beforeUnload()
    this._resetData()
    this._clearWatcher()
  },
  methods: {
    _clearWatcher() {
      // 清除mpvue的wathcers
      if (!this.$mp) return
      this._watchers = []
      this._watcher && this._watcher.teardown()
    },
    _resetData() {
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
  }
}
