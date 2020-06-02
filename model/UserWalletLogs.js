const mongoose = require("mongoose");

var userWalletLogsSchema = mongoose.Schema({
  transId: {
    type: String,
    unique: true
  },
  transType: {
    type: String
  },
  accountType: {
    type: String
  },
  amount: {
    type: String,
    default: 0
  },
  balance: {
    type: String,
    default: 0
  },
  currency: {
    type: String
  },
  account: {
    type: String
  },
  username: {
    type: String
  },
  updateDate: {
    type: Date,
    default: Date.now
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

userWalletLogsSchema.pre("save", function (next) {
  this.updateDate = Date.now();
  return next();
});

const UserWalletLogs = mongoose.model(
  "UserWalletLogs",
  userWalletLogsSchema,
  "UserWalletLogs"
);
module.exports = UserWalletLogs;
