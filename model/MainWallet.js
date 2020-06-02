const mongoose = require("mongoose");

var mainWalletSchema = mongoose.Schema({
  account: {
    type: String,
    unique: true
  },
  amount: {
    type: Number,
    default: 0
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

mainWalletSchema.pre("save", function (next) {
  this.updateDate = Date.now();
  return next();
});

var MainWallet = mongoose.model("MainWallet", mainWalletSchema, "MainWallet");
module.exports = MainWallet;
