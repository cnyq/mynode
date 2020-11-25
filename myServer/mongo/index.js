const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/itcart', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const user_base = mongoose.model('user_base', require('./user_base'))

module.exports = {
  user_base
}