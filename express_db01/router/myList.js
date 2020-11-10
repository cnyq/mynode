const express = require('express')
const { log } = console
// const fs = require('fs')
const router = express.Router()
const { findAll, addItem, findById, upDataAll,deleteItem } = require('./myListFun')

router.get('/', (req, res) => {
  // fs.readFile('./db.json', 'utf8', (err, data) => {
  //   if (err) return res.status(500).send('server error.')
  //   res.render('index.html', {
  //     myList: JSON.parse(data).myList
  //   })
  // })
  findAll((err, data) => {
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
  addItem({
    item: req.body, callback: (err) => {
      if (err) return res.status(500).send('server error.')
    }
  })
  res.redirect('/')
})

router.get('/edit', (req, res) => {
  findById(req.query.id, (err, data) => {
    if (err) return res.status(500).send('server error.')
    res.render('edit.html', {
      myList: data
    })
  })
})

router.post('/edit', (req, res) => {
  upDataAll(req.body, (err) => {
    if (err) return res.status(500).send('server error.')
  })
  res.redirect('/')
})

router.get('/delete', (req, res) => {
  deleteItem(req.query.id, err => {
    if (err) return res.status(500).send('server error.')
    res.redirect('/')
  })
})

module.exports = router

// module.exports = (app) => {
//   app.get('/', (req, res) => {
//     fs.readFile('./db.json', 'utf8', (err, data) => {
//       if (err) return res.status(500).send('server error.')
//       res.render('index.html', {
//         myList: JSON.parse(data).myList
//       })
//     })
//   })
// }