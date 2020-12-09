const { acticle_db, tag_db } = require('../../mongo/index')
const { sendData } = require('../../utils/sendData')

module.exports = function (router) {
  router.post('/acticleAdd', (req, res) => {
    console.log(req.body)
    let arr = ['1111', '2212122']
    res.send(sendData(200, { memu: arr }))
  })
}