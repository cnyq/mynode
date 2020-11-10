const http = require('http')
const fs = require('fs')
const template = require('art-template')
const url = require('url')

const {
  comments
} = require('./view/menu')

http
  .createServer((req, res) => {
    let parseObj = url.parse(req.url,true),
      pathname = parseObj.pathname
    if (pathname === '/') {
      fs.readFile('./view/index.html', (err, data) => {
        if (err) return res.end('404 Not Found')
        let htmlStr = template.render(data.toString(),{
          comments: comments
        })
        res.end(htmlStr)
      })
    }else if (pathname === '/post') {
      fs.readFile('./view/post.html', (err, data) => {
        if (err) return res.end('404 Not Found')
        res.end(data)
      })
    }else if(pathname === '/pinglun'){
      console.log('...收到表单请求',parseObj.query)
      let comment = parseObj.query
        comment.time = '2020/11/6'
      comments.unshift(comment)
      res.statusCode = 301
      res.setHeader('Location','/')
      // res.end(JSON.stringify(parseObj.query))
      res.end()
    }else{
      res.end('404 Not Found')
    }

  })
  .listen(3000,()=>{
    console.log('server running...')
  })