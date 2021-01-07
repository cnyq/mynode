const { acticle_db: ACTICLE, tag_db: TAG } = require('../../mongo/index')

module.exports = function (router) {
  router.get('/acticleList', (req, res) => {
    Promise.all([ACTICLE.fetchData(req.query), ACTICLE.fetchCount(req.query)])
      .then(resolve => {
        res.sendDataFtm(200, { list: resolve[0], total: resolve[1] })
      })
      .catch(e => res.status(500).send('server error.'))
  })
  router.post('/acticleAdd', (req, res) => {
    let _data = req.body
    let str = (Math.random() * (new Date() - 0)).toString()
    _data.code = parseInt(str.slice(0, 8))
    _data.create_time = (new Date()).getTime()
    let idArr = _data.tag.map(it => it._id)
    let codeArr = _data.tagCode.map(it => ({code: it}))
    _data.tag = idArr
    _data.tagCode = codeArr
    new ACTICLE(_data).save().then(async it => {
      let id = it._id
      await TAG.find({ _id: { $in: idArr } }, async (err, docs) => {
        if (err) return res.status(500).send('server error.')
        for (const item of docs) {
          item.acticle.push(id)
          await item.save()
        }
      })
      res.sendDataFtm(200)
    }).catch(err => {
      console.log('err-------', err)
    })
  })
  router.get('/acticleInfo', (req, res) => {
    let _id = req.query.id
    ACTICLE.findById(_id).populate({ path: 'tag', select: 'name' }).exec((err, data) => {
      if (err) return res.status(500).send('server error.')
      // console.log(data)
      res.sendDataFtm(200, data)
    })
  })
  router.post('/acticleEdit', (req, res) => {
    let id = req.body._id
    console.log(req.body)
    ACTICLE.update({ _id: id }, req.body, (err, data) => {
      console.log('err-----', err)
      console.log(data)
      if (err) return res.status(500).send('server error.')
      // console.log(data)
      res.sendDataFtm(200)
    })
  })
  router.get('/tagList', (req, res) => {
    TAG.fetchData(req.query, (err, data) => {
      if (err) return res.status(500).send('server error.')
      res.sendDataFtm(200, { list: data })
    })
  })
  router.post('/tagAdd', async (req, res) => {
    let _data = req.body
    if (!_data.name) {
      res.sendDataFtm(400, null, 'tag名称不能为空')
    } else {
      let _doc
      await TAG.findOne({ $where: `this.name == "${_data.name}"` }, (err, doc) => {
        console.log('aaa')
        _doc = doc
      })
      if (_doc) {
        res.sendDataFtm(400, null, `tag为${_data.name}名称的已存在`)
      } else {
        let str = (Math.random() * (new Date() - 0)).toString()
        _data.code = parseInt(str.slice(0, 8))
        new TAG(_data).save().then(it => {
          // console.log('it',it)
          res.sendDataFtm(200)
        }).catch(err => {
          console.log(err)
          res.sendDataFtm(500, null, '失败')
        })
      }
    }
  })
  
}