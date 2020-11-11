const express = require('express')
const bodyParser = require('body-parser')
const { log } = console
const app = express()
const post = 3000
const router = require('./router/myList')
// router(app)
app
  .use('/public',express.static('./public'))
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .engine('html',require('express-art-template'))
  .use(router)
  .listen(post, () => {
    log('running...')
  })
