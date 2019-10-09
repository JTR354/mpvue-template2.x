export default {
  onUnload() {
    // 清除mpvue的wathcers
    this._watchers = []
    this._watcher && this._watcher.teardown()
  }
}
