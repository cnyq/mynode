const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  // res.cookie('token','1111')
  // console.log(req.cookies)
  res.send('hello world')
})


module.exports = router