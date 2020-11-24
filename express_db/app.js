const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const post = 3000
const router = require('./router')
// const path = require('path');
// 1、path.dirname()  :获取目录
// 2、path.basename() ：获取文件名.扩展名(我们统称为全名)
// 3、path.extname()  : 获取扩展名
// 4、path.parse()    : 将一个路径转换成一个js对象
// 5、path.format()   ：将一个js对象转换成路径
// 6、join()          : 拼接多个路径成一个路径
// 7、path.resolve() :将相对路径转为绝对路径
app
  .use('/public', express.static('./public'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .engine('html', require('express-art-template'))
  .use(router)
  .listen(post, () => {
    console.log('running...')
  })