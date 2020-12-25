const { user_db: USER } = require('../../mongo/index')
const crypto = require('../../utils/myCrypto')

module.exports = function (router) {
  router.post('/register', (req, res) => {
    let { username, password } = req.body;
    USER.find({ username: username }, (err, data) => {
      console.log(err, data)
      if (err) return res.status(500).send('server error.');
      if (data.length) {
        res.sendDataFtm(200, { status: 0, hint: '该用户已注册' }, false)
      } else {
        let _data={
          username: username,
          password: crypto.md5(password)
        }
        new USER(_data).save().then(it => {
          res.sendDataFtm(200, { status: 1, hint: '注册成功' })
        }).catch(err => {
          console.log(err)
          res.sendDataFtm(500, null, '失败')
        })
      }
    })
  })
  router.post('/login', (req, res) => {
    let { username, password } = req.body;
    USER.find({ username: username }, (err, data) => {
      console.log(err, data ,req.body)
      if (err) return res.status(500).send('server error.');
      if (!data.length) {
        res.sendDataFtm(200, { status: 0 }, '该用户未注册')
      } else {
        let passwordMd5 = crypto.md5(password)
        if(passwordMd5 == data[0].password){
          res.sendDataFtm(200, { status: 1 })
        }else{
          res.sendDataFtm(200, { status: 0, hint: '密码不正确' }, false)
        }
      }
    })
  })
}