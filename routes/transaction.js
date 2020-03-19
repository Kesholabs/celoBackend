var express = require("express");
var router = express.Router();
const Controller = require("../controller/transactionController");

/* POST DEPOSIT /api/v1/transaction/deposit */
router.post("/deposit", Controller.deposit);

/* POST WITHDRAW - /api/v1/transaction/withdraw */
router.post("/withdraw", Controller.withdraw);

/* POST TRANSFER- /api/v1/transaction/transfer */
router.post("/transfer", Controller.transfer);

module.exports = router;
