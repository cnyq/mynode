const { acticle_db, tag_db } = require('../mongo/index')


module.exports = function (router) {
  router.post('/acticleAdd', (req, res) => {
    console.log(req.body)
  })
}