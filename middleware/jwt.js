const jwt = require("jsonwebtoken");
const Helper = require("../helper/helper");
const logger = Helper.getLogger("JWTAuth_MIDDLEWARE");

const secretKey = process.env.SECRET_KEY;

const jsonwtSign = data => {
  return jwt.sign(data, secretKey, { expiresIn: "1h" });
};

const verify = async (req, res, next) => {
  let header = req.headers.authorization;

  if (!header) {
    const msg = "Auth token not available";
    logger.error(msg);
    const response = await Helper.getErrorUnathorized("Unauthorized");
    return res.status(401).json(response);
  }

  try {
    logger.debug(
      "\n\n ================\n\n%s\n\n=================\n\n",
      header
    );
    jwt.verify(header, secretKey, async (err, verify) => {
      if (err) {
        logger.error(err);
        const response = await Helper.getErrorUnathorized(err);
        return res.status(401).json(response);
      }
      console.log(verify);
      return next();
    });
  } catch (error) {
    logger.error(error + " Token Received " + header);
    const response = await helper.getErrorUnathorized(
      "Auth token failed or invalid"
    );
    return res.status(401).json(response);
  }
};

exports.verify = verify;
exports.jsonwtSign = jsonwtSign;
