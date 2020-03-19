const express = require('express')
const authClient = require('../../../middleware/authenticationgaurd')
const blockService = require('../../../services/version1/blockservice/blockservice')


let router = express.Router();

router.post('/upload',authClient.authClientToken, blockService.uploadContent)
router.get('/details',blockService.fetch_data)

module.exports = router