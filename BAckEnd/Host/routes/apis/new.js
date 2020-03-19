const express = require('express');
const blockServiceController = require('../../controllers/apis/version1/blockservice')
const  authClient = require('../../middleware/authenticationgaurd')
const userController = require('../../controllers/apis/version1/user.controller') 
let router = express.Router();


router.use('/user',userController)

module.exports = router;