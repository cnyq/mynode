const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const post = 3000
const router = require('./router')

app
  .use('/public', express.static('./public'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .engine('html', require('express-art-template'))
  .use(router)
  .listen(post, () => {
    console.log('running...')
  })