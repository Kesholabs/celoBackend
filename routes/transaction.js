var express = require("express");
var router = express.Router();
const Jwt = require('../middleware/jwt');
const Controller = require("../controller/transactionController");

/**
 * @swagger
 *
 * definitions:
 *   TransactionModel:
 *     type: object
 *     required:
 *       - account
 *     properties:
 *       account:
 *         type: string
 *         example: username or phonenumber 
 *       amount:
 *          type: string
 *          example: 100
 *       currency:
 *          type: string
 *          example: <Optional> USD, GB, KES
 *       recipient:
 *          type: string
 *          example: <Optional!> username or phonenumber
 *   OrclModel:
 *     type: object
 *     required:
 *       - phoneNumber
 *       - account
 *     properties:
 *       phoneNumber:
 *         type: string
 *         example: 2547
 *       account:
 *         type: string
 *         example: username or phonenumber 
 *       amount:
 *          type: string
 *          example: 100
 *       currency:
 *          type: string
 *          example: <Optional> USD, GB, KES
 *   ApiModel:
 *     type: object
 *     required:
 *       - account
 *     properties:
 *       code:
 *         type: string
 *       sucessful:
 *          type: boolean
 *       message:
 *          type: object
 *
 *
 */

/**
 * @swagger
 *
 * /transaction/deposit:
 *   post:
 *     tags: ['Transaction']
 *     summary: Deposit cUSD on your wallet ACCOUNT
 *     description: 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in:  body
 *         description: A function for depositing 
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/TransactionModel'
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 *       401:
 *         description: Error Occurred - Invalid Access Token
 *     security:
 *      - Bearer: []
 */

/* POST DEPOSIT /api/v1/transaction/deposit */
router.post("/deposit",Jwt.verify, Controller.deposit);


/**
 * @swagger
 *
 * /transaction/oracle/deposit:
 *   post:
 *     tags: ['Transaction']
 *     summary: Deposit cUSD on your wallet ACCOUNT
 *     description: 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in:  body
 *         description: A function for depositing 
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/OrclModel'
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 */
router.post("/oracle/deposit", Controller.orclDeposit);
/**
 * @swagger
 *
 * /transaction/withdraw:
 *   post:
 *     tags: ['Transaction']
 *     summary: Withdraw cUSD on your wallet ACCOUNT
 *     description: 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in:  body
 *         description: A function for depositing 
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/TransactionModel'
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 *       401:
 *         description: Error Occurred - Invalid Access Token
 *     security:
 *      - Bearer: []
 */

/* POST WITHDRAW - /api/v1/transaction/withdraw */
router.post("/withdraw",Jwt.verify, Controller.withdraw);

/**
 * @swagger
 *
 * /transaction/transfer:
 *   post:
 *     tags: ['Transaction']
 *     summary: Transfer cUSD from one ACCOUNT to another ACCOUNT
 *     description: 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in:  body
 *         description: A function for depositing 
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/TransactionModel'
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 *       401:
 *         description: Error Occurred - Invalid Access Token
 *     security:
 *      - Bearer: []
 */

/* POST TRANSFER- /api/v1/transaction/transfer */
router.post("/transfer",Jwt.verify, Controller.transfer);

module.exports = router;
