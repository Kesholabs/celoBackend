const express = require('express')

const usrService = require('../../../services/version1/user/user')

let Router = express.Router()

Router.use('/register', usrService.register)

module.exports = Router