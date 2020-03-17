var mongoose = require("mongoose");

var celoUserWalletLogsSchema = mongoose.Schema({
  transID: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  account: {
    type: String
  },
  amount: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  transType: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

var CeloUserWalletLogs = mongoose.model(
  "CeloUserWalletLogs",
  celoUserWalletLogsSchema,
  "CeloUserWalletLogs"
);
module.exports = CeloUserWalletLogs;
