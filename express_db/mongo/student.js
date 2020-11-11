const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/itcart', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
const studentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  age: {
    type: Number
  }
})

module.exports = mongoose.model('Student', studentSchema)