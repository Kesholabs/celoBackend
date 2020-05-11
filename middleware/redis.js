const redis = require("redis");
var bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
const REDIS_PORT = process.env.REDIS_PORT;
const Helper = require("../helper/helper");
const logger = Helper.getLogger("REDIS_MIDDLEWARE");
const JWT = require("./jwt");

const client = redis.createClient(REDIS_PORT);

client.on("connect", function () {
  logger.info("Redis client connected");
});

client.on("error", function (err) {
  logger.error("Something went wrong " + err);
});

//methods
const setAccounts = async (key, value) => {
  console.log(key + ":" + value);
  const hashPrivatekey = await Helper.generateHash(value);
  return client.set(key, hashPrivatekey, redis.print);
};

const getAccount = async (key, value) => {
  // logger.debug("auth details ", key, value);
  let msg = "Unauthorized";

  let isUserAvailable = await client.getAsync(key);
  console.log("Available User ", isUserAvailable);
  if (!isUserAvailable) {
    logger.info("User does not exist in the system");
    logger.info("Create user ", key);
    await setAccounts(key, value);
  }

  logger.info("User exist in the system");
  logger.info("Validate password");

  var results = client.getAsync(key).then(async result => {
    if (!result) {
      logger.error(`${msg} User doesn't exits...Create new user`);
      return msg;
    }

    logger.debug("Found user with password");

    if (!(await Helper.validPassword(value, result))) {
      logger.error(msg);
      return msg;
    }

    // logger.debug("Generating JWT token ", key);

    let token = await JWT.jsonwtSign({ key });
    logger.debug("Issue JWT ", token);
    return token;
  });

  return results;
};

module.exports = { client, setAccounts, getAccount };
