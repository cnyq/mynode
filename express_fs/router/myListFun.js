const dbPath = './db.json'
const fs = require('fs')

exports.findAll = (callback) => {
  readFileFun(dbPath, (err,data)=>{
    if (err) return callback(err)
    callback(null, data)
  })
}

exports.addItem = ({ item, callback }) => {
  readFileFun(dbPath, (err,data)=>{
    if (err) return callback(err)
    let myList = data
    item['id'] = myList[myList.length - 1].id + 1
    myList.push(item)
    let newJson = JSON.stringify({
      myList: myList
    })
    writeFileFun(dbPath, newJson, callback)
  })
  // fs.readFile(dbPath, 'utf8', (err, data) => {
  //   if (err) return callback(err)
  //   let myList = JSON.parse(data).myList
  //   item['id'] = myList[myList.length - 1].id + 1
  //   myList.push(item)
  //   let newJson = JSON.stringify({
  //     myList: myList
  //   })
  //   // fs.writeFile(dbPath, newJson, (err) => {
  //   //   if (err) return callback(err)
  //   //   callback(null)
  //   // })
  //   writeFileFun(dbPath, newJson, callback)
  // })
}

exports.findById = (id, callback) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return callback(err)
    let myList = JSON.parse(data).myList
    let item = myList.find(it => it.id == parseInt(id))
    callback(null, item)
  })
}

exports.upDataAll = (item, callback) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return callback(err)
    let myList = JSON.parse(data).myList
    // let itemOld = myList.find(it => it.id == parseInt(item.id))
    // for(let key in item){
    //   itemOld[key] = item[key]
    // }
    item.id = parseInt(item.id)
    myList.forEach(it => {
      if (it.id == item.id) {
        for (let key in item) {
          it[key] = item[key]
        }
      }
    });
    let newJson = JSON.stringify({
      myList: myList
    })
    writeFileFun(dbPath, newJson, callback)
  })
}

exports.deleteItem = (id, callback) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return callback(err)
    let myList = JSON.parse(data).myList
    let num = myList.findIndex(it => it.id == parseInt(id))
    myList.splice(num, 1)
    myList.forEach((it,i)=>{
      it.id = i
    })
    let newJson = JSON.stringify({
      myList: myList
    })
    writeFileFun(dbPath, newJson, callback)
  })
}

const readFileFun = (dbPath, callback) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return callback(err)
    callback(null, JSON.parse(data).myList)
  })
}
const writeFileFun = (dbPath, newJson, callback) => {
  fs.writeFile(dbPath, newJson, (err) => {
    if (err) return callback(err)
    callback(null)
  })
}

