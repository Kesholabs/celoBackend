const mongoose = require("mongoose");
const config = require(__dirname + "./../config." + process.env.NODE_ENV);


const MONGODB_URI = config.MONGO_DB_URL;
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
          logger.error("❌❌⛔⛔📛🚫🚫 MongoDB connection error: " + err);
          process.exit(1);
        } else {
          logger.info("🚀  Connected Successfully");
        }
      }
    );

    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
  }
};
