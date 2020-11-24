const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collect_nfo = new Schema({
  md_id:{
    type: String
  },
  collect_time:{
    type: Date,
    default: Date.now
  }
})

const user_base = new Schema({
  nick_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  certificate: {
    type: String,
    required: true
  },
  create_time: {
    type: Date,
    default: Date.now
  },
  collect:[collect_nfo]
})

module.exports = user_base