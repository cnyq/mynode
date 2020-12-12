const { sendData } = require('../utils/sendData')

function sendD() {
  return function (req, res, next) {
    res.sendDataFtm = (code, data, msg) => {
      res.send(sendData(code, data, msg))
    }
    next();
  }
}

module.exports = { sendD };