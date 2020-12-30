const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tag_nfo = new Schema({
  tag_name: {
    type: String,
    required: true
  },
  tag_code: {
    type: Number,
    required: true
  }
})

const acticle_db = new Schema({
  code: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    required: true
  },
  tag: [tag_nfo],
  author: {
    type: String,
    required: true
  },
  mdPath: {
    type: String,
    required: true
  },
  create_time: {
    type: Number
  },
  writing_time: {
    type: Number
  }
})

//查询方法
acticle_db.statics = {
  fetch(query, cb) {
    let pageSize = parseInt(query.pageSize),
      pageNum = parseInt(query.pageNum),
      name = query.name || '',
      author = query.author || '',
      startTime = query.startTime || '',
      endTime = query.endTime || ''
    let regName = new RegExp(name, 'i')
    let regAuthor = new RegExp(author, 'i')
    let _date = (new Date()).getTime();
    let findArr = this.find({ '$and': [{ 'name': { "$regex": regName } }, { 'author': { "$regex": regAuthor } }, { 'writing_time': { "$lte": endTime ? endTime : _date, "$gt": startTime ? startTime : 0 } }] })
    findArr.sort('-writing_time')
      .limit(pageSize)
      .skip((pageNum - 1) * pageSize)
      .exec(cb);
    return findArr
  }
}

module.exports = acticle_db