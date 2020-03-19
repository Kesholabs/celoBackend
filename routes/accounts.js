var express = require("express");
var router = express.Router();
const Controller = require("../controller/accounts");

/**
 * @swagger
 *
 * definitions:
 *   AccountModel:
 *     type: object
 *     required:
 *       - account
 *     properties:
 *       account:
 *         type: string
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
 * /account/create:
 *   post:
 *     description: Creates a user account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: Account object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/AccountModel'
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 */

/* POST Create Account- /api/v1/account/create */
router.post("/create", Controller.createAddressAccount);

/**
 * @swagger
 *
 *  /account/getaccount:
 *   post:
 *     description: Creates a user account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: Account object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/AccountModel'
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 */

/* POST Get Wallet Account - /api/v1/account/getaccount */
router.post("/getaccount", Controller.getWalletAddress);

/**
 * @swagger
 *
 *  /account/getbalance:
 *   post:
 *     description: Creates a user account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: Account object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/AccountModel'
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 */
/* GET Get Balance - /api/v1/account/getaccount */
router.post("/getbalance", Controller.getAddressBalance);

module.exports = router;
