const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tag_relevance = new Schema({
  act_code:{
    type: Number
  }
})

const tag_info = new Schema({
  tag_name:{
    type: String,
    required: true
  },
  tag_code:{
    type: Number,
    required: true
  },
  tag_relevance:[tag_relevance]
})

const tag_db = new Schema({
  tag_info: [tag_info]
})

module.exports = tag_db