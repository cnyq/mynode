const { user_db: USER } = require('../../mongo/index')
const crypto = require('../../utils/myCrypto')
const { creatToken } = require('../../utils/jwt')
const { myVerify } = require('../../utils/jwt')

module.exports = function (router) {
  router.post('/register', (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) return res.sendDataFtm(200, { status: 0, hint: '账户/密码不能为空' }, false)
    USER.find({ username: username }, (err, data) => {
      // console.log(err, data)
      if (err) return res.status(500).send('server error.');
      if (data.length) {
        res.sendDataFtm(200, { status: 0, hint: '该用户已注册' }, false)
      } else {
        let _data = {
          username: username,
          password: crypto.md5(password),
          create_time: (new Date() - 0)
        }
        new USER(_data).save().then(it => {
          let _sendData = creatToken(username)
          res.sendDataFtm(200, {
            status: 1,
            token: _sendData, userInfo: {
              username: username
            },
            hint: '注册成功'
          })
        }).catch(err => {
          console.log(err)
          res.sendDataFtm(500, null, '注册失败')
        })
      }
    })
  })
  router.post('/login', (req, res) => {
    // console.log('req.headers.cookie', req.headers.cookie)
    let { username, password } = req.body;
    USER.find({ username: username }, (err, data) => {
      // console.log(err, data, req.body)
      if (err) return res.status(500).send('server error.');
      if (!data.length) {
        res.sendDataFtm(200, { status: 0, hint: '该用户未注册' }, false)
      } else {
        let passwordMd5 = crypto.md5(password)
        if (passwordMd5 == data[0].password) {
          let _sendData = creatToken(username)
          res.sendDataFtm(200, {
            status: 1, token: _sendData, userInfo: {
              username: username
            }
          })
        } else {
          res.sendDataFtm(200, { status: 0, hint: '密码不正确' }, false)
        }
      }
    })
  })
  router.get('/user', (req, res) => {
    let token = req.cookies['token']
    myVerify(token, (err, data) => {
      if (err) {
        return res.send(sendData(401))
      } else {
        let username = data.username
        res.sendDataFtm(200, {
          status: 1, userInfo: {
            username: username
          }
        })
      }
    })

  })
  router.get('/userList', (req, res) => {
    Promise.all([USER.fetchData(req.query), USER.fetchCount(req.query)])
      .then(resolve => {
        res.sendDataFtm(200, { list: resolve[0], total: resolve[1] })
      })
      .catch(e => res.status(500).send('server error.'))
  })
}