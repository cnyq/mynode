const { acticle_db: ACTICLE, tag_db: TAG, acticle_html_db: ACTICLEHTML } = require('../../mongo/index')
const { toObjectIdStr, getArrDifference, getCode } = require('../../utils/common')
const { findUser, authUser } = require('../../utils/authUser')

module.exports = function (router) {
  router.get('/acticleList', (req, res) => {
    Promise.all([ACTICLE.fetchData(req.query), ACTICLE.fetchCount(req.query)])
      .then(resolve => {
        res.sendDataFtm(200, { list: resolve[0], total: resolve[1] })
      })
      .catch(e => res.status(500).send('server error.'))
  })
  router.post('/acticleAdd', async (req, res) => {
    //权限
    let token = req.cookies['token'], authUsername = ""
    await authUser(token, 2).then(it => {
      authUsername = it
    })
    if (!authUsername) return res.sendDataFtm(500, null, '权限不足')
    //校验字段
    let _data = req.body, isValidator = ''
    await ACTICLE.validatorData(_data).then(it=>{
      isValidator = it
    })
    if (isValidator) return res.sendDataFtm(500, null, isValidator)
    if (authUsername != _data.username) return res.sendDataFtm(500, null, '管路员用户不匹配')
    
    console.log('authUsername',authUsername)
    let idArr = _data.tag.map(it => it._id)
    _data.tag = idArr
    _data.code = getCode()
    _data.username = authUsername
    _data.publishStatus = 2
    
    let acticleId = ''
    await new ACTICLE(_data).save().then(it => {
      acticleId = it._id
    })
    await TAG.find({ _id: { $in: idArr } }, async (err, docs) => {
      if (err) return res.status(500).send('server error.')
      for (const item of docs) {
        item.acticle.push(acticleId)
        await item.save()
      }
    })
    await ACTICLEHTML.findById(_data.mdInfo._id, (err, docs) => {
      if (err) return res.status(500).send('server error.')
      docs.acticle = acticleId
      docs.save()
    })

    res.sendDataFtm(200)
  })
  router.get('/acticleInfo', (req, res) => {
    let _id = req.query.id
    ACTICLE.findById(_id).populate({ path: 'tag', select: 'name code' }).populate({ path: 'mdInfo', select: 'name' }).exec((err, data) => {
      if (err) return res.status(500).send('server error.')
      // console.log(data)
      res.sendDataFtm(200, data)
    })
  })
  router.post('/acticleEdit', async (req, res) => {
    let token = req.cookies['token'], authUsername = ""
    await authUser(token, 2).then(it => {
      authUsername = it
    })
    if (!authUsername) return res.sendDataFtm(500, null, '权限不足')
    let id = req.body._id
    let oldTagArr = [],
      newTagArr = req.body.tag.map(it => (it._id.toString()))
    await ACTICLE.findById(id, (err, data) => {
      if (err) return res.status(500).send('server error.')
      // oldTagArr = data.tag.map(it => mongoose.Types.ObjectId(it).toString())
      oldTagArr = toObjectIdStr(data.tag)
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
  router.post('/acticleDel', async (req, res) => {
    let token = req.cookies['token'], authUsername = ""
    await authUser(token, 2).then(it => {
      authUsername = it
    })
    if (!authUsername) return res.sendDataFtm(500, null, '权限不足')
    let id = req.body._id, findTagArr = [], isErr = false, mdInfo = ''
    await ACTICLE.findById(id, (err, data) => {
      if (err || !data) return isErr = true
      findTagArr = toObjectIdStr(data.tag)
      mdInfo = data.mdInfo
    })
    if (isErr) return res.status(500).send('server error.')
    if (findTagArr.length > 0) {
      await TAG.find({ _id: { $in: findTagArr } }, async (err, docs) => {
        if (err) return isErr = true
        for (const item of docs) {
          let _index = item.acticle.indexOf(id)
          if (_index != -1) {
            item.acticle.splice(_index, 1)
            await item.save()
          } else {
            isErr = true
            break
          }
        }
      })
    }
    if (isErr) return res.status(500).send('server error.')
    await ACTICLEHTML.findByIdAndRemove(mdInfo, (err, doc) => {
      if (err) return res.status(500).send('server error.')
    })
    ACTICLE.findByIdAndDelete(id).exec((err, doc) => {
      if (err) return res.status(500).send('server error.')
      res.sendDataFtm(200)
    })
  })
  router.get('/tagList', (req, res) => {
    Promise.all([TAG.fetchData(req.query), TAG.fetchCount(req.query)])
      .then(resolve => {
        res.sendDataFtm(200, { list: resolve[0], total: resolve[1] })
      })
      .catch(e => res.status(500).send('server error.'))
  })
  router.post('/tagAdd', async (req, res) => {
    let token = req.cookies['token'], authUsername = ""
    await authUser(token, 1).then(it => {
      authUsername = it
    })
    if (!authUsername) return res.sendDataFtm(500, null, '权限不足')
    let _data = req.body
    console.log('_data', _data)
    if (!_data.name) {
      res.sendDataFtm(201, null, 'tag名称不能为空')
    } else {
      let _doc
      await TAG.findOne({ name: _data.name }, (err, doc) => {
        console.log('err', err)
        _doc = doc
      })
      console.log('_doc', _doc)
      if (_doc) {
        res.sendDataFtm(201, null, `tag为${_data.name}名称的已存在`)
      } else {
        _data.code = getCode()
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
  router.post('/tagDel', async (req, res) => {
    let token = req.cookies['token'], authUsername = ""
    await authUser(token, 1).then(it => {
      authUsername = it
    })
    if (!authUsername) return res.sendDataFtm(500, null, '权限不足')
    let id = req.body._id, findActicleArr = [], isErr = false
    await TAG.findById(id, (err, data) => {
      if (err || !data) return isErr = true
      findActicleArr = toObjectIdStr(data.acticle)
    })
    if (isErr) return res.sendDataFtm(500, null, 'id错误')
    let acticleName = ''
    if (findActicleArr.length > 0) {
      await ACTICLE.find({ _id: { $in: findActicleArr } }, async (err, docs) => {
        if (err) return isErr = true
        for (const item of docs) {
          let _index = item.tag.indexOf(id)
          console.log('_index,item.tag',item.tag,_index)
          if (_index != -1 && item.tag.length > 1) {
            item.tag.splice(_index, 1)
            await item.save()
          } else {
            acticleName = item.name
            isErr = true
            break
          }
        }
      })
    }
    if (isErr) return res.sendDataFtm(201, null, `此tag被${acticleName}文章唯一引用`)
    TAG.findByIdAndDelete(id).exec((err, doc) => {
      if (err) return res.sendDataFtm(201, null, 'tag删除失败')
      res.sendDataFtm(200)
    })
  })
}