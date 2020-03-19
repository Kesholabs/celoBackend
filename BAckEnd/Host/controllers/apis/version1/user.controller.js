const express = require('express')

const usrService = require('../../../services/version1/user/user')
const validation = require('../../../middleware/validation')

let Router = express.Router()

Router.use('/register', validation.registrationBody(), usrService.register)
Router.use('/login', validation.registrationBody(), usrService.login)

module.exports = Router