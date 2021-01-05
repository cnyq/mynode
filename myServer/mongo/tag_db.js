const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const tag_relevance = new Schema({
//   code: {
//     type: Number
//   }
// })

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
    let name = query.name || '',
      regName = new RegExp(name, 'i')
    let findArr = this.find({ '$and': [{ 'name': { "$regex": regName } }] }, { name: 1 })
    findArr.sort()
      .exec(cb);
    return findArr
  }
}

module.exports = tag_db