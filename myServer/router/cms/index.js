const express = require('express')
const router = express.Router()

require('./article')(router)
require('./users')(router)

module.exports = router