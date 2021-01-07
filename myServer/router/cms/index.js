const express = require('express')
const router = express.Router()

require('./article')(router)
require('./users')(router)
require('./upFile')(router)

module.exports = router