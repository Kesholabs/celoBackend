const mongoose = require("mongoose");

var mainWalletLogsSchema = mongoose.Schema({
  transId: {
    type: String,
    unique: true
  },
  transType: {
    type: String
  },
  account: {
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
  recipientAccount: {
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

mainWalletLogsSchema.pre("save", function (next) {
  this.updateDate = Date.now();
  return next();
});

var MainWalletLogs = mongoose.model(
  "MainWalletLogs",
  mainWalletLogsSchema,
  "MainWalletLogs"
);
module.exports = MainWalletLogs;
