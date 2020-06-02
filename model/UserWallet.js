const mongoose = require("mongoose");

var userWalletSchema = mongoose.Schema({
  account: {
    type: String,
    unique: true
  },
  amount: {
    type: Number,
    default: 0
  },
  currency: {
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

userWalletSchema.pre("save", function (next) {
  this.updateDate = Date.now();
  return next();
});

const UserWallet = mongoose.model("UserWallet", userWalletSchema, "UserWallet");
module.exports = UserWallet;
