## 小程序报错Unexpected end of JSON input如下图
![](https://img2020.cnblogs.com/blog/1342461/202005/1342461-20200527152657036-1434752015.png)
### 原因
参数中有不识别的字符
### 解决方案
```html
  //父页面
  let item = JSON.stringify(json)
  wx.navigateTo({
      url: '/xxx?item=' + encodeURIComponent(item)
  })
  //子页面
  onLoad: function(options){
      let item = JSON.parse(decodeURIComponent(optines.item))
  }
     
```