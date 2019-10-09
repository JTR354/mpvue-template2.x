import wx from '../utils/wx'

export default {
  createSelectorQuery () {
    return wx.createSelectorQuery()
  },
  select (query, el, type = 'boundingClientRect') {
    switch (type) {
      case 'boundingClientRect':
        query.select(el).boundingClientRect()
        break
      default:
        break
    }
  },
  selectAll (query, el, type = 'boundingClientRect') {
    switch (type) {
      case 'boundingClientRect':
        query.selectAll(el).boundingClientRect()
        break
      default:
        break
    }
  },
  exec(query, callback) {
    query.exec(callback)
  }
}
