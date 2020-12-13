const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tag_relevance = new Schema({
  act_code:{
    type: Number
  }
})

const tag_db = new Schema({
  name:{
    type: String,
    required: true
  },
  code:{
    type: Number,
    required: true
  },
  relevance:[tag_relevance]
})

module.exports = tag_db