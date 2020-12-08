const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tag_nfo = new Schema({
  tag_name:{
    type: String,
    required: true
  },
  tag_code:{
    type: Number,
    required: true
  }
})

const acticle_db = new Schema({
  act_code:{
    type: Number,
    required: true
  },
  acticle_name: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    required: true
  },
  acticle_tag: [tag_nfo],
  author: {
    type: String,
    required: true
  },
  create_time: {
    type: Date,
    default: Date.now
  },
  writing_time:{
    type: Date
  },
  collect:[collect_nfo]
})

module.exports = acticle_db