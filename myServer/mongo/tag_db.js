const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tag_db = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: Number,
    required: true
  },
  acticle: [{ type: mongoose.Schema.Types.ObjectId, ref: 'acticle_db' }]
})

tag_db.statics = {
  //查询方法
  fetchData(query, cb) {
    // let name = query.name || '',
    //   regName = new RegExp(name, 'i')
    // let findArr = this.find({ '$and': [{ 'name': { "$regex": regName } }] }, { name: 1, code: 1 }).populate({ path: 'acticle', select: 'name' })
    // findArr.sort()
    //   .exec(cb);
    // return findArr
    return new Promise((res, rej) => {
      let pageSize = parseInt(query.pageSize) || 0,
        pageNum = parseInt(query.pageNum) || 0,
        populateArg = pageSize ? { path: 'acticle', select: 'name' } : '',
        selectArg = pageSize ? 'name code acticle' : 'name code'
      this.findCommon(query)
        .select(selectArg)
        .populate(populateArg)
        .sort('name')
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
  findCommon(query, cb) {
    let name = query.name || '',
      regName = new RegExp(name, 'i'),
      findCondition = []
    if (name) {
      findCondition.push({ 'name': { "$regex": regName } })
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

module.exports = tag_db