const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  account: {
    type: String,
    unique: true
  },
  pin: {
    type: String,
    default: "Not Touched"
  },
  token: {
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

userSchema.pre("save", function (next) {
  this.updateDate = Date.now();
  return next();
});

var UserAccount = mongoose.model("UserAccount", userSchema, "UserAccount");
module.exports = UserAccount;
