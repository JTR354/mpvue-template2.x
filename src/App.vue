<script>
import AppPromise from '@utils/app-promise'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
  },
  onShow () {
    AppPromise.getInstance(resolve => {     // eslint-disable-line
      console.log('mock： ===> app on show 延迟5s!!!==mpvuePlatform=>', mpvuePlatform)
      setTimeout(() => {
        resolve(true)
      }, 5000)
    })
  }
}
</script>
