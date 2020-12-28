const { sendData } = require('../utils/sendData')
const { myVerify } = require('../utils/jwt')

function sendD() {
  return function (req, res, next) {
    res.sendDataFtm = (code, data, msg) => {
      res.send(sendData(code, data, msg))
    }
    next();
  }
}

function verifyToken() {
  return function (req, res, next) {
    if (req.url == '/login' || req.url == '/register') {
      next();
      return
    }
    let token = req.cookies['token']
    myVerify(token, (err, data) => {
      if (err) {
        console.log('err:' + JSON.stringify(err))
        res.send(sendData(401))
      } else {
        console.log('data:' + JSON.stringify(data))
        next();
      }
    })
  }
}

module.exports = { sendD, verifyToken };