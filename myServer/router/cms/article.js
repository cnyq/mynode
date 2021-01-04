const { acticle_db: ACTICLE, tag_db: TAG } = require('../../mongo/index')
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
let server = '10.16.38.66';
let port = 3000;

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
    new ACTICLE(_data).save().then(it => {
      res.sendDataFtm(200)
    }).catch(err => {
      console.log(err)
      res.sendDataFtm(500, null, '失败')
    })
  })
  router.get('/tagList', (req, res) => {
    TAG.fetchData(req.query, (err, data) => {
      if (err) res.status(500).send('server error.')
      res.sendDataFtm(200, { list: data })
    })
  })
  router.post('/tagAdd', async (req, res) => {
    let _data = req.body
    if (!_data.name) {
      res.sendDataFtm(400, null, 'tag名称不能为空')
    } else {
      let _doc
      await TAG.findOne({ $where: `this.name == ${_data.name}` }, (err, doc) => {
        console.log('aaa')
        _doc = doc
      })
      if (_doc) {
        res.sendDataFtm(400, null, `tag为${_data.name}名称的已存在`)
      } else {
        let str = (Math.random() * (new Date() - 0)).toString()
        _data.code = parseInt(str.slice(0, 8))
        new TAG(_data).save().then(it => {
          res.sendDataFtm(200)
        }).catch(err => {
          console.log(err)
          res.sendDataFtm(500, null, '失败')
        })
      }
    }
  })
  router.post('/uploadMd', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../public/md');
    form.keepExtensions = true;
    // 获取文件
    form.parse(req, (err, fields, files) => {
      console.log(err)
      if (err) return next(err);
      let date = (new Date()).getTime();
      let oldPath = files.file.path;
      console.log(`oldPath: ${oldPath}`);
      let mdName = files.file.name;
      console.log(`mdName: ${mdName}`);
      let newMdName = mdName.replace(/[^.]+/, `md_${date}`);
      console.log(`newMdName: ${newMdName}`);
      let newPath = path.join(path.dirname(oldPath), newMdName);
      console.log(`newPath: ${newPath}`);
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          throw err;
        } else {
          res.sendDataFtm(200, {
            url: "http://" + server + ":" + port + "/public/md/" + newMdName,
            name: mdName
          })
        }
      });
    });
  })
}