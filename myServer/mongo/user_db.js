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

const user_db = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  create_time: {
    type: Date,
    default: Date.now
  },
  collect:[collect_nfo]
})

module.exports = user_db