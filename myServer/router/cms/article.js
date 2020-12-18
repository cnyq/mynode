const { acticle_db, tag_db } = require('../../mongo/index')
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
let server = '10.16.38.66';
let port = 3000;

module.exports = function (router) {
  router.get('/acticleList', (req, res) => {
    acticle_db.countDocuments({}, (err, count) => {
      if (err) return res.status(500).send('server error.');
      acticle_db.fetch(req.query, (err, data) => {
        console.log(err)
        if (err) return res.status(500).send('server error.');
        res.sendDataFtm(200, { list: data, total: count })
      })
    })
  })
  router.post('/acticleAdd', (req, res) => {
    let _data = req.body
    let str = (Math.random()*(new Date() - 0)).toString()
    _data.code = parseInt(str.slice(0, 8))
    _data.create_time = (new Date()).getTime()
    new acticle_db(_data).save().then(it => {
      res.sendDataFtm(200)
    }).catch(err => {
      console.log(err)
      res.sendDataFtm(500, null, '失败')
    })
    // res.sendDataFtm(200, { memu: arr })
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