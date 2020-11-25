const express = require('express')
const router = express.Router()
const { user_base } = require('../mongo/index')
const { sendData } = require('../utils/sendData')

router.get('/list', (req, res) => {
  // let obj = {
  //   nick_name:'aaa',
  //   email:'aaa',
  //   certificate:'aaa',
  //   collect:[]
  // }
  // new user_base(obj).save().then(() => console.log('保存成功'));
  let arr = ['1111', '2212122']
  res.send(sendData(200, { memu: arr }))
})

module.exports = router