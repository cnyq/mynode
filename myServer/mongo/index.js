const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/itcart', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const user_db = mongoose.model('user_db', require('./user_db'))
const acticle_db = mongoose.model('acticle_db', require('./user_db'))
const tag_db = mongoose.model('tag_db', require('./tag_db'))

module.exports = {
  user_db,
  acticle_db,
  tag_db
}