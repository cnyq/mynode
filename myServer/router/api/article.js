const { acticle_db: ACTICLE, tag_db: TAG } = require('../../mongo/index')
const { toObjectIdStr, getArrDifference } = require('../../utils/common')
module.exports = function (router) {
  router.get('/acticleList', (req, res) => {
    Promise.all([ACTICLE.fetchData(req.query), ACTICLE.fetchCount(req.query)])
      .then(resolve => {
        res.sendDataFtm(200, { list: resolve[0], total: resolve[1] })
      })
      .catch(e => res.status(500).send('server error.'))
  })
  router.get('/acticleInfo', (req, res) => {
    let _id = req.query.id
    ACTICLE.findById(_id).populate({ path: 'tag', select: 'name code' }).populate({ path: 'mdInfo', select: 'info code' }).exec((err, data) => {
      if (err) return res.status(500).send('server error.')
      // console.log(data)
      res.sendDataFtm(200, data)
    })
  })
  router.get('/tagList', (req, res) => {
    TAG.fetchData(req.query, (err, data) => {
      if (err) return res.status(500).send('server error.')
      res.sendDataFtm(200, { list: data })
    })
  })
}