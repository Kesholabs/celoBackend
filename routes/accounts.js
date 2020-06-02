var express = require("express");
var router = express.Router();
const Jwt = require("../middleware/jwt");
const Controller = require("../controller/accountController");

/**
 * @swagger
 *
 * definitions:
 *   AccountModel:
 *     type: object
 *     required:
 *       - account
 *       - password
 *     properties:
 *       account:
 *         type: string
 *         example: username or email or phonenumber
 *       type:
 *         type: string
 *         example: own | merchant
 *
 *   AddressModel:
 *     type: object
 *     required:
 *       - account
 *     properties:
 *       account:
 *         type: string
 *         example: username or email or phonenumber
 *
 *   BalanceModel:
 *     type: object
 *     required:
 *       - account
 *     properties:
 *       account:
 *         type: string
 *         example: username or email or phonenumber
 *       currency:
 *          type: string
 *          example: <Optional> USD, GB, KES
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
 *     tags: ['Account']
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
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 *       401:
 *         description: Error Occurred - Invalid Access Token
 */

/* POST Create Account- /api/v1/account/create */
router.post("/create", Controller.createAddressAccount);

/**
 * @swagger
 *
 *  /account/getaccount:
 *   post:
 *     tags: ['Account']
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
 *           $ref: '#/definitions/AddressModel'
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

/* POST Get Wallet Account - /api/v1/account/getaccount */
router.post("/getaccount", Jwt.verify, Controller.getWalletAddress);

/**
 * @swagger
 *
 *  /account/getbalance:
 *   post:
 *     tags: ['Account']
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
 *           $ref: '#/definitions/BalanceModel'
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
/* GET Get Balance - /api/v1/account/getaccount */
router.post("/getbalance", Jwt.verify, Controller.getAddressBalance);

module.exports = router;
