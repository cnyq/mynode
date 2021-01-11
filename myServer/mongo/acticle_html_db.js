const mongoose = require('mongoose')
const Schema = mongoose.Schema

const acticle_html_db = new Schema({
  code: {
    type: Number,
    required: true
  },
  info:{
    type: String
  }
})

//查询方法
acticle_html_db.statics = {
}

module.exports = acticle_html_db