const express = require('express')
const router = express.Router()

const Student = require('../mongo/student')

router.get('/', (req, res) => {
  Student.find((err, data) => {
    if (err) return res.status(500).send('server error.')
    res.render('index.html', {
      myList: data
    })
  })
})

router.get('/add', (req, res) => {
  res.render('add.html')
})

router.post('/add', (req, res) => {
  let _data = new Student(req.body)
  _data.save().then(() => console.log('保存成功'));
  res.redirect('/')
})

router.get('/edit', (req, res) => {
  Student.findById(req.query.id, (err, data) => {
    if (err) return res.status(500).send('server error.')
    res.render('edit.html', {
      myList: data
    })
  })
})

router.post('/edit', (req, res) => {
  Student.findByIdAndUpdate(req.body.id, req.body, (err) => {
    if (err) return res.status(500).send('server error.')
  })
  res.redirect('/')
})


module.exports = router