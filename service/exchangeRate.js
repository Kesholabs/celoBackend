const axios = require("axios");
const cron = require("node-cron");
var fs = require("fs");
const helper = require("../helper/helper");
const logger = helper.getLogger("SERVICE_DELIVERY");


const schedule = cron.schedule("0 */1 * * *", async () => {
  logger.info(
    "\n\n=============== RUNNING A TASK EVERY HOUR ================\n\n"
  );

  const url = "https://openexchangerates.org/api/latest.json?app_id=2b0e9491c3d44b9999b4142103f606a4";

  axios
    .get(url)
    .then(response => {
      logger.debug(response.data);
      const rates = response.data;

      const fileName = "exchangeRates.json";

      fs.writeFile(fileName, JSON.stringify(rates), function(err) {
        if (err) throw new Error(err);
        logger.debug("EXCHANGE RATE DATA CREATED");
      });

    })
    .catch(error => {
      logger.error(error);
    });
});
