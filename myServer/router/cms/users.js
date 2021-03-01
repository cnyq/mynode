const { user_db: USER } = require('../../mongo/index')
const crypto = require('../../utils/myCrypto')
const { creatToken } = require('../../utils/jwt')
const { myVerify } = require('../../utils/jwt')
function findUser(username, isAuth = 3) {
  return new Promise((res, rej) => {
    USER.find({ username: username }, (err, data) => {
      if (err) return rej()
      if (!data.length) {
        res(false)
      } else {
        if (data[0].auth_status <= isAuth) {
          res(data)
        } else {
          res(false)
        }
      }
      res(data)
    })
  })
}
function authUser(token, auth) {
  return new Promise((res, rej) => {
    let username = ""
    myVerify(token, (err, data) => {
      username = data.username
    })
    if(!username) return res(false)
    findUser(username, auth).then(it => {
      if (it) {
        res(true)
      }else{
        res(false)
      }
    })
  })
}
module.exports = function (router) {
  router.post('/login', (req, res) => {
    // console.log('req.headers.cookie', req.headers.cookie)
    let { username, password } = req.body;
    findUser(username).then(data => {
      if (!data) {
        res.sendDataFtm(200, { status: 0, hint: '该用户未注册' }, false)
      } else {
        let passwordMd5 = crypto.md5(password)
        if (passwordMd5 == data[0].password) {
          let _sendData = creatToken(username)
          res.sendDataFtm(200, {
            status: 1, token: _sendData, userInfo: {
              username: username,
              auth_status: data[0].auth_status
            }
          })
        } else {
          res.sendDataFtm(200, { status: 0, hint: '密码不正确' }, false)
        }
      }
    }).catch(err => {
      res.status(500).send('server error.')
    })
  })

  router.post('/register', (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) return res.sendDataFtm(200, { status: 0, hint: '账户/密码不能为空' }, false)
    findUser(username).then(data => {
      if (data) {
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
              username: username,
              auth_status: 3
            },
            hint: '注册成功'
          })
        }).catch(err => {
          console.log(err)
          res.sendDataFtm(500, null, '注册失败')
        })
      }
    }).catch(err => {
      res.status(500).send('server error.')
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

  router.post('/userAdd',async (req, res) => {
    let token = req.cookies['token'], isAuth = false
    await authUser(token,1).then(it=>{
      isAuth = it
    })
    console.log(isAuth)
    if(!isAuth) return res.sendDataFtm(500,null,'权限不足')
  })
}