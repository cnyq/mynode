//cmd 
//show dbs 查看所有数据库
//db当前数据库
//ues XXX 使用数据库
//show collections 数据库下集合 
//db.cats.find() 查看集合
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

// const Cat = mongoose.model('Cat', { name: String });
const dogs = mongoose.model('dogs', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));
const boba = new dogs({ name: 'boba1' });
boba.save().then(() => console.log('wa'));