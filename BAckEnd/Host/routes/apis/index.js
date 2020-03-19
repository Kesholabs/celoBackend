const express = require('express');
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('../../../swagger.json');
const v1ApiController = require('./new');
let router = express.Router();
router.use('/v1', v1ApiController);
 
router.use('/api-docs', swaggerUi.serve);

module.exports = router;