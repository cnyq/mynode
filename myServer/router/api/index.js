const express = require('express')
const router = express.Router()

require('./article')(router)

module.exports = router