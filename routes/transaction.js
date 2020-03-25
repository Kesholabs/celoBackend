var express = require("express");
var router = express.Router();
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
 *
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
 *         description: users
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 */

/* POST DEPOSIT /api/v1/transaction/deposit */
router.post("/deposit", Controller.deposit);

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
 *         description: users
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 */

/* POST WITHDRAW - /api/v1/transaction/withdraw */
router.post("/withdraw", Controller.withdraw);

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
 *         description: users
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 */

/* POST TRANSFER- /api/v1/transaction/transfer */
router.post("/transfer", Controller.transfer);

module.exports = router;
