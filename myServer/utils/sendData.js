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
