const { acticle_db, tag_db } = require('../../mongo/index')

module.exports = function (router) {
  router.post('/acticleAdd', (req, res) => {
    // console.log(req.body)
    let arr = ['1111', '2212122']
    res.sendDataFtm(200, { memu: arr })
  })
  router.get('/cms', (req, res) => {
    let arr = ['1111', '2212122']
    res.sendDataFtm(200, { memu: arr })
  })
}