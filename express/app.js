const express = require('express')
const api = express()
const port = 3000

api
  .get('/', (req, res) => {
    res.send('hello wordq')
  })
  .listen(port, () => console.log(`Example app listening on port ${port}!`))