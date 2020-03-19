const express = require('express');
const userController = require('../../controllers/apis/version1/user.controller') 
let router = express.Router();


router.use('/user',userController)

module.exports = router;