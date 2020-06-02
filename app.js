require("dotenv").config();
var express = require("express");
var path = require("path");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./Docs/swaggerConfig");

// const redis = require("./middleware/redis");
const mongo = require("./db/mongo");

require("./service/exchangeRate");

var authRouter = require("./routes/auth");
var account = require("./routes/accounts");
var transaction = require("./routes/transaction");
var track = require("./routes/track");

var app = express();

const startApp = async () => {
  app.use(logger("dev"));
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: false
    })
  );
  app.use(cookieParser());
  app.use(cors());

  //redis
  // await redis.client();
  await mongo.dbConnection();

  //routes
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/account", account);
  app.use("/api/v1/transaction", transaction);
  app.use("/api/v1/track", track);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // set our port
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`🚀  Server ready at http://localhost:${port}`);
  });
};

startApp();

module.exports = app;
