```js
// demo-code
 _paintDraw() {
   let options = {
     canvasId: 'we-paint',
     multiple: 1,
     panel: {
       el: '.panel'
     },
     els: [
       {
         el: '.panel',
         drawType: 'rect',
         color: '#fff'
       },
       {
         el: '.h-avatar',
         drawType: 'img',
         source: this.avatarUrlTmp,
         mode: 'aspectFill',
         unLoad: false
       },
       {
         el: '.h-bg',
         drawType: 'img',
         source: this.imageUrl + '/zd-image/dynamic/bg-card_trends@2x.png',
         unLoad: false
       },
       {
         el: '.h-name',
         drawType: 'text',
         source: this.name,
         fontSize: 20,
         align: 'center',
         color: '#fff',
         yAdjust: -3
       },
       {
         el: '.h-title',
         drawType: 'text',
         source: this.hTitle,
         fontSize: 12,
         align: 'center',
         color: '#fff',
         yAdjust: -3
       },
       {
         el: '#icon',
         drawType: 'img',
         source: this.imageUrl + '/zd-image/dynamic/icon-time@2x.png',
         unLoad: false
       },
       {
         el: '#time',
         drawType: 'text',
         source: createdAt,
         fontSize: 12,
         color: '#828AA2',
         yAdjust: -3
       },
       {
         el: '.content > .words',
         drawType: 'text-area',
         source: content,
         fontSize: 16,
         color: '#333'
       },
       {
         el: cnameImgs,
         drawType: 'img',
         isSelectAll: true,
         sourceArr: newImgArr,
         mode: modeImgs,
         unLoad: false
       },
       {
         el: '.right > .txt',
         drawType: 'text',
         isSelectAll: true,
         sourceArr: this.qrCodeTxt,
         color: '#828AA2',
         fontSize: 12
       },
       {
         el: '.line',
         drawType: 'rect',
         color: '#EDEDEF'
       },
       {
         el: '.qr-code-wrapper',
         drawType: 'img',
         source: this.qrCodeUrlTmp,
         unLoad: false
       }
     ]
   }
   this.$refs.wePaint.action(options)
  }
```
