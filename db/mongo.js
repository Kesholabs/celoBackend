var mongoose = require("mongoose");
var helper = require("../helper/helper");
var logger = helper.getLogger("MONGODB_CONNECTION");

const MONGODB_URI = process.env.MONGO_DB_URL;

module.exports = {
  dbConnection() {
    mongoose.connect(
      `${MONGODB_URI}`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      },
      err => {
        if (err) {
          logger.error("MongoDB connection error: " + err);
          process.exit(1);
        } else {
          logger.debug("MongoDB Connected Successfully");
        }
      }
    );

    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useCreateIndex", true);
  }
};
