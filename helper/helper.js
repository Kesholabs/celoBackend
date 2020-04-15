const log4js = require("log4js");
const logger = log4js.getLogger("HELPER_METHOD");
logger.level = "debug";

function setTranstype(type) {
  switch (type) {
    case "Deposit":
      return "D" + generateTransID();
    case "Transfer":
      return "T" + generateTransID();
    case "Withdraw":
      return "W" + generateTransID();
    default:
      console.error("Ivalid transaction type %s", type);
      return "ERROR" + generateTransID();
  }
}

function generateTransID() {
  let length = 6;
  let timestamp = +new Date();

  let _getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  let ts = timestamp.toString();
  let parts = ts.split("").reverse();
  let id = "";

  for (let i = 0; i < length; ++i) {
    let index = _getRandomInt(0, parts.length - 1);
    id += parts[index];
  }
  return id;
}

// Generic error handler used by all endpoints.
const getErrorMessage = async field => {
  return {
    code: 400,
    success: false,
    message: field + " field is missing or Invalid in the request"
  };
};
// Generic successful handler used by all endpoints.
const getOtherErrorMessage = async field => {
  return {
    success: false,
    message: field
  };
};

// Generic successful handler used by all endpoints.
const getSuccessMessage = async field => {
  return {
    code: 200,
    success: true,
    message: field
  };
};

// Generic Logger
const getLogger = moduleName => {
  const logger = log4js.getLogger(moduleName);
  logger.level = "debug";
  return logger;
};

module.exports = {
  setTranstype,
  generateTransID,
  getErrorMessage,
  getOtherErrorMessage,
  getSuccessMessage,
  getLogger
};
