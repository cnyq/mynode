const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user_db = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  create_time: {
    type: Number
  },
  //1:所有权限，2：允许新增，3：游客
  auth_status: {
    type: Number,
    default: 3
  }
})

user_db.statics = {
  findCommon(query, cb) {
    let username = query.username || '',
      startTime = query.startTime || 0,
      endTime = query.endTime || 0,
      regName = new RegExp(username, 'i')
    findCondition = []
    if (username) {
      findCondition.push({ 'username': { "$regex": regName } })
    }
    if (startTime) {
      findCondition.push({ 'create_time': { "$gt": startTime } })
    }
    if (endTime) {
      findCondition.push({ 'create_time': { "$lte": endTime } })
    }
    let findArr
    if (findCondition.length == 0) {
      findArr = this.find()
    } else {
      findArr = this.find({
        '$and': findCondition
      })
    }
    return findArr
  },
  fetchData(query) {
    return new Promise((res, rej) => {
      let pageSize = parseInt(query.pageSize),
        pageNum = parseInt(query.pageNum)
      this.findCommon(query)
        .select('username create_time auth_status -_id')
        .sort('-create_time')
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
}

module.exports = user_db