var mongoose = require("mongoose");

var celoUserWalletSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  account: {
    type: String,
    unique: true,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

var CeloUserWallet = mongoose.model("CeloUserWallet", celoUserWalletSchema, "CeloUserWallet");
module.exports = CeloUserWallet;
