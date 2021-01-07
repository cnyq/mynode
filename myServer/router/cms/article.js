const { acticle_db: ACTICLE, tag_db: TAG } = require('../../mongo/index')
const mongoose = require('mongoose')
function toObjectId(ids) {
  if (ids.constructor === Array) {
    return ids.map(mongoose.Types.ObjectId);
  }
  return mongoose.Types.ObjectId(ids);
}

function getArrDifference(arr1, arr2) {
  return arr1.concat(arr2).filter(function (v, i, arr) {
    // console.log(arr, arr.indexOf(v), arr.lastIndexOf(v))
    return arr.indexOf(v) === arr.lastIndexOf(v);
  });
}

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
    // _data.create_time = (new Date()).getTime()
    let idArr = _data.tag.map(it => it._id)
    _data.tag = idArr
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
    ACTICLE.findById(_id).populate({ path: 'tag', select: 'name code' }).exec((err, data) => {
      if (err) return res.status(500).send('server error.')
      // console.log(data)
      res.sendDataFtm(200, data)
    })
  })
  router.post('/acticleEdit', async (req, res) => {
    let id = req.body._id
    // console.log(req.body)
    let oldTagArr = [],
      newTagArr = req.body.tag.map(it => (it._id.toString()))
    await ACTICLE.findById(id, (err, data) => {
      if (err) return res.status(500).send('server error.')
      oldTagArr = data.tag.map(it=>mongoose.Types.ObjectId(it).toString())
    })
    // console.log(oldTagArr, newTagArr)
    let findTag = getArrDifference(oldTagArr, newTagArr)
    // console.log('findTag', findTag)
    if (findTag.length > 0) {
      await TAG.find({ _id: { $in: findTag } }, async (err, docs) => {
        if (err) return res.status(500).send('server error.')
        // console.log('docs',docs)
        for (const item of docs) {
          let _index = item.acticle.indexOf(id)
          if (item.acticle.indexOf(id) < 0) {
            item.acticle.push(id)
          } else {
            item.acticle.splice(_index, 1)
          }
          await item.save()
        }
      })
    }
    ACTICLE.updateOne({ _id: id }, req.body, (err, data) => {
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