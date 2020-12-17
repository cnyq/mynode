const { acticle_db, tag_db } = require('../../mongo/index')
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
let server = '10.16.38.66';
let port = 3000;

module.exports = function (router) {
  router.get('/acticleList', (req, res) => {
    console.log('req.query', req.query)
    // console.log('req', req)
  })
  router.post('/acticleAdd', (req, res) => {
    console.log(req.body)
    let _data = req.body
    _data.code = new Date() - 0
    _data.create_time = new Date()
    new acticle_db(_data).save().then(res => {
      res.sendDataFtm(200)
    }).catch(err => {
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