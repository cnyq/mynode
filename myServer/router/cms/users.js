const { user_db: USER } = require('../../mongo/index')
const crypto = require('../../utils/myCrypto')
const { creatToken, myVerify } = require('../../utils/jwt')
const { findUser, authUser } = require('../../utils/authUser')

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

  router.post('/userAdd', async (req, res) => {
    let token = req.cookies['token'], isAuth = false
    await authUser(token, 1).then(it => {
      isAuth = it
    })
    if (!isAuth) return res.sendDataFtm(500, null, '权限不足')
    let { username, password, auth_status } = req.body
    findUser(username).then(data => {
      if (data) {
        res.sendDataFtm(200, { status: 0, hint: '该用户名已被注册' }, false)
      } else {
        if (auth_status == 1) return res.sendDataFtm(200, { status: 0, hint: '禁止超级管理员注册' }, false)
        let _data = {
          username: username,
          password: crypto.md5(password),
          create_time: (new Date() - 0),
          auth_status: auth_status
        }
        new USER(_data).save().then(it => {
          res.sendDataFtm(200, { status: 1, hint: '新增成功' })
        }).catch(err => {
          console.log(err)
          res.sendDataFtm(500, null, '新增失败')
        })
      }
    }).catch(err => {
      res.sendDataFtm(500)
    })
  })
  router.post('/userEdit', async (req, res) => {
    let token = req.cookies['token'], isAuth = false
    await authUser(token, 1).then(it => {
      isAuth = it
    })
    if (!isAuth) return res.sendDataFtm(500, null, '权限不足')
    let { username, password, auth_status } = req.body
    findUser(username).then(data => {
      if (!data) {
        res.sendDataFtm(200, { status: 0, hint: '未找到该用户' }, false)
      } else {
        let id = data[0]._id
        if (auth_status == 1) return res.sendDataFtm(200, { status: 0, hint: '禁止超级管理员更改失败' }, false)
        let _data = {
          password: crypto.md5(password),
          auth_status: parseInt(auth_status)
        }
        // data[0].password = crypto.md5(password)
        // data[0].auth_status = parseInt(auth_status)
        // data[0].save()
        console.log('_data', _data)
        USER.updateOne({ _id: id }, _data, (err, data) => {
          if (err) return res.status(500).send('server error.')
          console.log(data)
          res.sendDataFtm(200, { status: 1, hint: '编辑成功' })
        })
      }
    }).catch(err => {
      res.sendDataFtm(500)
    })
  })
  router.post('/userDel', async (req, res) => {
    let token = req.cookies['token'], isAuth = false
    await authUser(token, 1).then(it => {
      isAuth = it
    })
    if (!isAuth) return res.sendDataFtm(500, null, '权限不足')
    let { username, auth_status } = req.body
    findUser(username).then(data => {
      if (!data) {
        res.sendDataFtm(200, { status: 0, hint: '未找到该用户' }, false)
      } else {
        let id = data[0]._id
        if (auth_status == 1) return res.sendDataFtm(200, { status: 0, hint: '禁止超级管理员禁止删除' }, false)
        USER.findByIdAndDelete(id).exec((err, doc) => {
          if (err) return res.status(500).send('server error.')
          res.sendDataFtm(200, { status: 1, hint: '删除成功' }, false)
        })
      }
    }).catch(err => {
      res.sendDataFtm(500)
    })
  })
  router.post('/postwordChange', async (req, res) => {
    let token = req.cookies['token'],
      getUsername = ''
    myVerify(token, (err, data) => {
      getUsername = data.username
    })
    await findUser(getUsername).then(data => {
      if (data) {
        let { _id, username, password } = data[0]
        let checkUsername = req.body.username,
          checkpPassword = crypto.md5(req.body.oldPassword),
          newPassword = crypto.md5(req.body.newPassword)
        if (username != checkUsername) return res.sendDataFtm(200, { status: 0, hint: '用户校验有误' }, false)
        if (password != checkpPassword) return res.sendDataFtm(200, { status: 0, hint: '原密码输入有误' }, false)
        if (password == newPassword) return res.sendDataFtm(200, { status: 0, hint: '新密码与旧密码不能相同' }, false)
        USER.updateOne({ _id: _id }, { password: newPassword }, (err, data) => {
          if (err) return res.status(500).send('server error.')
          console.log(data)
          res.sendDataFtm(200, { status: 1, hint: '修改成功' })
        })
      } else {
        res.sendDataFtm(200, { status: 0, hint: '未找到该用户' }, false)
      }
    })
  })
}