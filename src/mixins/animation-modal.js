const DURATION_SHOW = 300
const DURATION_CANCEL = 300
export default {
  data() {
    return {
      maskAnimation: '',
      modalAnimation: ''
    }
  },
  methods: {
    showAnimation(callback, duration = 500) {
      let maskAnimation = wx.createAnimation({
        duration: DURATION_SHOW,
        timingFunction: 'linear',
        delay: 0
      })
      maskAnimation.opacity(0).step()
      this.maskAnimation = maskAnimation.export()
      setTimeout(() => {
        maskAnimation.opacity(1).step()
        this.maskAnimation = maskAnimation.export()
        callback && callback()
      }, 200)
    },
    hideAnimation(callback, duration = 300) {
      let maskAnimation = wx.createAnimation({
        duration: DURATION_CANCEL,
        timingFunction: 'linear',
        delay: 0
      })
      maskAnimation.opacity(0).step()
      this.maskAnimation = maskAnimation.export()
      setTimeout(() => {
        maskAnimation.opacity(1).step()
        this.maskAnimation = maskAnimation.export()
        callback && callback()
      }, 300)
    }
  }
}
