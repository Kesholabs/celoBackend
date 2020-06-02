var express = require("express");
var router = express.Router();
const Jwt = require("../middleware/jwt");
const Controller = require("../controller/authController");

/**
 * @swagger
 *
 * definitions:
 *   AuthModel:
 *     type: object
 *     required:
 *       - account
 *       - password
 *     properties:
 *       account:
 *         type: string
 *         example: username or phonenumber
 *       password:
 *          type: string
 *          example: account2019
 *
 *
 *   ChangePwdModel:
 *     type: object
 *     required:
 *       - password
 *       - newpassword
 *     properties:
 *       account:
 *         type: string
 *         example: john@gmail.com
 *       password:
 *          type: string
 *          example: new password
 */

/**
 * @swagger
 *
 * /auth:
 *   post:
 *     tags: ['Auth']
 *     summary: Validate account ownership and generate jwt
 *     description:
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: auth
 *         in:  body
 *         description: A function validating account ownership
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/AuthModel'
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 *       401:
 *         description: Error Occurred - Invalid Access Token
 */

/* AUTH - /api/v1/auth */
router.post("/", Controller.validateAccount);

/**
 * @swagger
 *
 * /auth/changepassword:
 *   post:
 *     tags: ['Auth']
 *     summary: Change password
 *     description:
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: auth
 *         in:  body
 *         description: A function for changing password
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/ChangePwdModel'
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

/* AUTH - /api/v1/auth/changepassword */
router.post("/changepassword", Controller.changePassword);


/* AUTH - /api/v1/auth/resetpassword/:token */
router.post("/reset", Controller.redirect);

module.exports = router;
