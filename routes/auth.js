var express = require("express");
var router = express.Router();
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

/* POST DEPOSIT /api/v1/auth */
router.post("/", Controller.validateAccount);

module.exports = router;
