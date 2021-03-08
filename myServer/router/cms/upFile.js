const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const marked = require("marked")
const { getCode } = require('../../utils/common')
const { acticle_html_db: ACTICLEHTML} = require('../../mongo/index')
let server = '10.16.38.66';
let port = 9527;

function read(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
function delFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

module.exports = function (router) {
  //上传文档
  router.post('/uploadMd', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../public/md');
    form.keepExtensions = true;
    // 获取文件
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).send('server error.')
      let path = files.file.path,name = files.file.name, toHtml = ''
      // console.log(files)
      await read(path).then(data => {
        toHtml = JSON.stringify(marked(data));
      }).catch(err => {
        return res.status(500).send('server error.', err)
      })
      await delFile(path).then(it => {
        if (it) console.log('文件:' + path + '删除成功！');
      }).catch(err => {
        return res.status(500).send('server error.', err)
      })
      let _data = {
        code: getCode(),
        info: toHtml,
        name: name
      }
      await new ACTICLEHTML(_data).save().then(it=>{
        res.sendDataFtm(200, {
          _id: it._id,
          code: it.code,
          name: name
        })
      }).catch(err=>{
        return res.status(500).send('server error.', err)
      })
    });
  })
  router.post('/delActicleInfo',(req,res)=>{
    let id = req.body._id
    ACTICLEHTML.findByIdAndDelete(id).exec((err, doc) => {
      if (err) return res.status(500).send('server error.')
      res.sendDataFtm(200)
    })
  })
  // 上传图片api
  router.post('/uploadImg', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../public/images');
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) return next(err);
      let code = getCode();
      let oldPath = files.file.path;
      console.log(`oldPath: ${oldPath}`);
      let imgName = files.file.name;
      console.log(`imgName: ${imgName}`);
      let newImgName = imgName.replace(/[^.]+/, `img_${code}`);
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