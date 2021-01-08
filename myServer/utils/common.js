const mongoose = require('mongoose')

exports.toObjectId = (ids) => {
  if (Array.isArray(ids)) {
    return ids.map(mongoose.Types.ObjectId);
  }
  return mongoose.Types.ObjectId(ids);
}

exports.toObjectIdStr = (ids) => {
  if (Array.isArray(ids)) {
    return ids.map(it => mongoose.Types.ObjectId(it).toString());
  }
  return mongoose.Types.ObjectId(ids).toString()
}

exports.getArrDifference = (arr1, arr2) => {
  return arr1.concat(arr2).filter(function (v, i, arr) {
    return arr.indexOf(v) === arr.lastIndexOf(v);
  });
}


exports.sendData = (code, data = null, msg = '') => {
  let obj = {}
  switch (code) {
    case 200:
      obj = {
        code: 200,
        data: data,
        msg: msg || 'success'
      }
      break;
    case 400:
      obj = {
        code: 400,
        data: data,
        msg: msg || 'error'
      }
      break;
    case 401:
      obj = {
        code: 401,
        data: data,
        msg: msg || '登录失效'
      }
      break;
    case 500:
      obj = {
        code: 500,
        data: data,
        msg: msg || 'error'
      }
      break;
  }
  return obj
}
