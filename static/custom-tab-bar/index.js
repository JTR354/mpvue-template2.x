Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/index/index",
      iconPath: "/static/img/icon-select.png",
      selectedIconPath: "/static/img/icon-select.png",
      text: "组件"
    }, {
      pagePath: "/index/index2",
      iconPath: "/static/img/icon-select.png",
      selectedIconPath: "/static/img/icon-select.png",
      text: "接口"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})
