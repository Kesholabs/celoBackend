var express = require("express");
var router = express.Router();
const Jwt = require("../middleware/jwt");
const Controller = require("../controller/TrackController");

/**
 * @swagger
 *
 * definitions:
 *   MainModel:
 *     type: object
 *     required:
 *       - amount
 *       - account
 *     properties:
 *       amount:
 *         type: string
 *         example: 1000
 *       name:
 *          type: string
 *          example: joe@gmail.com
 */

/**
 * @swagger
 *
 * /track:
 *   post:
 *     tags: ['Admin']
 *     summary: Add funds to main account
 *     description:
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Main Account
 *         in:  body
 *         description: A function for adding funds
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/MainModel'
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/ApiModel'
 *       401:
 *         description: Error Occurred - Invalid Access Token
 */

/* POST DEPOSIT /api/v1/track */
router.post("/",  Controller.addFunds);


module.exports = router;