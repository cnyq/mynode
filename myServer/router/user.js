const express = require('express')
const router = express.Router()
const {user_base} = require('../mongo/index')

router.get('/user', (req, res) => {
  let obj = {
    nick_name:'aaa',
    email:'aaa',
    certificate:'aaa',
    collect:[]
  }
  new user_base(obj).save().then(() => console.log('保存成功'));
  res.send('hello user')
})

module.exports = router