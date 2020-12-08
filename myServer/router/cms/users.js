module.exports = function(router){
  router.get('/b', (req, res) => {
    // res.cookie('token','1111')
    // console.log(req.cookies)
    res.send('users')
  })
}