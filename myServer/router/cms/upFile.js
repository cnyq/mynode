const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
let server = '10.16.38.66';
let port = 3000;

module.exports = function (router) {
  //上传文档
  router.post('/uploadMd', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../public/md');
    form.keepExtensions = true;
    // 获取文件
    form.parse(req, (err, fields, files) => {
      console.log('err',err,fields,files)
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
          res.status(500).send('server error.')
        } else {
          res.sendDataFtm(200, {
            url: "http://" + server + ":" + port + "/public/md/" + newMdName,
            name: mdName
          })
        }
      });
    });
  })
  // 上传图片api
  router.post('/uploadImg', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../public/images');
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) return next(err);
      let date = (new Date()).getTime();
      let oldPath = files.file.path;
      console.log(`oldPath: ${oldPath}`);
      let imgName = files.file.name;
      console.log(`imgName: ${imgName}`);
      let newImgName = imgName.replace(/[^.]+/, `img_${date}`);
      console.log(`newImgName: ${newImgName}`);
      let newPath = path.join(path.dirname(oldPath), newImgName);
      console.log(`newPath: ${newPath}`);
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          res.status(500).send('server error.')
        } else {
          res.sendDataFtm(200, {
            url: "http://" + server + ":" + port + "/public/images/" + newImgName,
            name: newImgName
          })
        }
      });
    });
  });
}