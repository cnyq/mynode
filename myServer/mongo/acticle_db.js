const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const tagCode = new Schema({
//   code: {
//     type: Number,
//     // required: true
//   }
// })

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
  author: {
    type: String,
    required: true
  },
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tag_db' }],
  mdInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'acticle_html_db' },
  tagCode: [],
  create_time: {
    type: Number
  },
  writing_time: {
    type: Number
  },
  banner: []
})

//查询方法
acticle_db.statics = {
  // fetch(query, cb) {
  //   let pageSize = parseInt(query.pageSize),
  //     pageNum = parseInt(query.pageNum),
  //     name = query.name || '',
  //     author = query.author || '',
  //     startTime = query.startTime || '',
  //     endTime = query.endTime || ''
  //   let regName = new RegExp(name, 'i')
  //   let regAuthor = new RegExp(author, 'i')
  //   let _date = (new Date()).getTime();
  //   let findArr = this.find({ '$and': [{ 'name': { "$regex": regName } }, { 'author': { "$regex": regAuthor } }, { 'writing_time': { "$lte": endTime ? endTime : _date, "$gt": startTime ? startTime : 0 } }] })
  //   findArr.sort('-writing_time')
  //     .limit(pageSize)
  //     .skip((pageNum - 1) * pageSize)
  //     .exec(cb);
  //   return findArr
  // }
  fetchData(query) {
    return new Promise((res, rej) => {
      let pageSize = parseInt(query.pageSize),
        pageNum = parseInt(query.pageNum)
      this.findCommon(query)
        .populate({ path: 'tag', select: 'name' })
        .sort('-writing_time')
        .limit(pageSize)
        .skip((pageNum - 1) * pageSize)
        .exec((err, data) => {
          if (err) console.log(err)
          res(data)
        });
    })
  },
  fetchCount(query) {
    return new Promise((res, rej) => {
      this.findCommon(query)
        .countDocuments({}, (err, count) => {
          if (err) rej(err)
          res(count)
        })
    })
  },
  toObjectId(ids) {
    if (ids.constructor === Array) {
      return ids.map(mongoose.Types.ObjectId);
    }
    return mongoose.Types.ObjectId(ids);
  },
  findCommon(query, cb) {
    let name = query.name || '',
      author = query.author || '',
      startTime = query.startTime || '',
      endTime = query.endTime || '',
      tagArr = query.tag ? query.tag.split(',') : '',
      regName = new RegExp(name, 'i'),
      regAuthor = new RegExp(author, 'i'),
      findCondition = []
    if (name) {
      findCondition.push({ 'name': { "$regex": regName } })
    }
    if (author) {
      findCondition.push({ 'author': { "$regex": regAuthor } })
    }
    if (startTime) {
      findCondition.push({ 'writing_time': { "$gt": startTime } })
    }
    if (endTime) {
      findCondition.push({ 'writing_time': { "$lte": endTime } })
    }
    if (tagArr) {
      let tagMap = tagArr.map(value => ({ "$elemMatch": { 'code': parseInt(value) } }));
      findCondition.push({ 'tagCode': { "$all": tagMap } })
    }

    let findArr
    // console.log(JSON.stringify(findCondition))
    if (findCondition.length == 0) {
      findArr = this.find()
    } else {
      findArr = this.find({
        '$and': findCondition
      })
    }

    return findArr
  }
}

module.exports = acticle_db