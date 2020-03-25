const axios = require("axios");
const cron = require("node-cron");
const jsonexport = require("jsonexport");
var jsonToCSV = require("json-to-csv");
var fs = require("fs");
const helper = require("../helper/helper");
const logger = helper.getLogger("SERVICE_DELIVERY");

// var reader = fs.createReadStream("data.json");
// var writer = fs.createWriteStream("out.csv");

const schedule = cron.schedule("* * * * *", async () => {
  logger.info(
    "\n\n=============== RUNNING A TASK EVERY MINUTE ================\n\n"
  );

  const url = "https://api.exchangeratesapi.io/latest";

  axios
    .get(url)
    .then(response => {
      logger.debug(response.data);
      const rates = response.data;

      const fileName = "exchangeRates.json";

      fs.writeFile(fileName, JSON.stringify(rates), function(err) {
        if (err) throw new Error();
        logger.debug("EXCHANGE RATE DATA CREATED");
      });

      // jsonToCSV(rates, fileName)
      //   .then(() => {
      //     // success
      //     logger.debug("EXCHANGE RATE DATA CREATED");
      //   })
      //   .catch(error => {
      //     // handle error
      //     logger.debug("EXCHANGE RATE DATA FAILED");
      //   });

      // let writer = fs.createWriteStream("exchangeRates.json");
      // rates.pipe(jsonexport()).pipe(writer);

      // jsonexport(rates, (err, csv) => {
      //   if (err) return logger.error(err);
      //   logger.info("create rates csv ", csv);
      //   fs.createWriteStream("exchangeRates.csv");
      // });
    })
    .catch(error => {
      logger.error(error);
    });
});
