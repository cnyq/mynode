const { user_db: USER } = require('../mongo/index')
const { myVerify } = require('./jwt')

const findUser = (username, isAuth = 3) => {
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
const authUser = (token, auth) => {
  return new Promise((res, rej) => {
    let username = ""
    myVerify(token, (err, data) => {
      username = data.username
    })
    if (!username) return res(false)
    findUser(username, auth).then(it => {
      if (it) {
        res(username)
      } else {
        res("")
      }
    })
  })
}

// exports.findUser = findUser
// exports.authUser = authUser

module.exports = {
  findUser,
  authUser
}