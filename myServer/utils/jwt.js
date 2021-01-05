const jwt = require('jsonwebtoken')
const secret = 'cnyanqun_key'

exports.myVerify = (token, callback) => {
  jwt.verify(token, secret, (err, data) => {
    callback(err, data)
  })
}
exports.creatToken = (username) => {
  return jwt.sign({ username: username }, secret, { expiresIn: 60 * 60 * 24 })
}