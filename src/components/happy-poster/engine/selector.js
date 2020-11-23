// 指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值，id class style 和事件绑定的属性值不可获取）
const properties = [
  'mode',
  'src'
]

// 指定样式名列表，返回节点对应样式名的当前值
const computedStyle = [
  'backgroundColor',
  'background',
  'color',
  'fontFamily',
  'fontSize',
  'textAlign',
  'lineHeight',
  // 'padding',
  'borderRadius',
  'boxShadow',
  'fontWeight'
]

function selectAllElements(arr) {
  const query = wx.createSelectorQuery()
  const selectArray = arr.map(item => {
    return selectAll(query, item.el)
  })
  return Promise.all(selectArray).then(res => {
    return res.reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  })
}

function selectAll(query, el) {
  return new Promise((resolve, reject) => {
    query
      .selectAll(el)
      .fields({
        size: true,
        dataset: true,
        mark: true,
        rect: true,
        properties,
        computedStyle
      }, resolve)
      .exec()
  })
}

export default function (arr) {
  if (!(arr instanceof Array)) {
    throw new Error('els 应为为数组')
  }
  return selectAllElements(arr)
}