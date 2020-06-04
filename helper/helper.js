const log4js = require("log4js");
const bcrypt = require("bcrypt");
const logger = log4js.getLogger("HELPER_METHOD");
logger.level = "debug";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.EMAIL_APIKEY);

// Generic error handler used by all endpoints.
const getErrorMessage = async field => {
  return {
    code: 400,
    success: false,
    message: field + " field is missing or Invalid in the request"
  };
};

// Generic error handler used by all endpoints.
const getErrorUnathorized = async field => {
  return {
    code: 401,
    success: false,
    message: field + " request"
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

const generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};

const validPassword = function (issuedPassword, password) {
  return bcrypt.compareSync(issuedPassword, password);
};

var generateTransID = function (transtype) {
  let length = 15;
  let timestamp = +new Date();

  var _getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var ts = timestamp.toString();
  var parts = ts.split("").reverse();
  var id = "";

  for (var i = 0; i < length; ++i) {
    var index = _getRandomInt(0, parts.length - 1);
    id += parts[index];
  }

  return id;
};

var transTypeID = function (type) {
  logger.debug(
    "\n\n================== GENERATING TRANSID %s =========================\n\n",
    type
  );

  switch (type) {
    case "Creation":
      return "C" + generateTransID();
    case "Deposit":
      return "D" + generateTransID();
    case "Withdraw":
      return "W" + generateTransID();
    case "Transfer":
      return "T" + generateTransID();
    default:
      return "Invalid" + generateTransID();
  }
};

var sendEmail = async function (account, subject, token) {
  console.log("\n\n=============== SENDING EMAIL ================\n\n");

  // const urlRedirection = `https://celo.pesabase.com/api/v1/auth/resetpassword/${token}`;
  const urlRedirection = `https://pesabase.com/resetpassword/${token}`;
  const emailRes = false;
  const message = await htmlMessage(urlRedirection, account);

  try {
    const mailOptions = {
      to: account,
      from: "info@deficon.africa",
      subject: subject,
      html: `${message}`
    };

    try {
      const info = await sgMail.send(mailOptions);
      if (!info) {
        logger.error(error);
        return emailRes;
      }

      logger.info("\n Email Sent \n");
      return true;
    } catch (err) {
      logger.error(err);
    }
  } catch (error) {
    logger.error(error);
  }
};

var htmlMessage = function (url, email) {
  return `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting">
      <title></title>
      
      <link href="https://fonts.googleapis.com/css?family=Poppins:400,600" rel="stylesheet" type="text/css"> 
      
      <style>
          html,
          body {
              margin: 0 auto !important;
              padding: 0 !important;
              height: 100% !important;
              width: 100% !important;
              font-family: 'Poppins', sans-serif !important;
              font-size: 14px;
              margin-bottom: 10px;
              line-height: 22px;
              color:#526283;
              font-weight: 400;
          }
          * {
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
              margin: 0;
              padding: 0;
          }
          table,
          td {
              mso-table-lspace: 0pt !important;
              mso-table-rspace: 0pt !important;
          }
          table {
              border-spacing: 0 !important;
              border-collapse: collapse !important;
              table-layout: fixed !important;
              margin: 0 auto !important;
          }
          table table table {
              table-layout: auto;
          }
          a {
              text-decoration: none;
          }
          img {
              -ms-interpolation-mode:bicubic;
          }
      </style>
  
  </head>
  
  <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #eaf3fc;">
    <center style="width: 100%; background-color: #eaf3fc;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#eaf3fc">
              <tr>
                 <td style="padding: 40px 0;">
                      <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;border:1px solid #e3edf8;border-bottom:4px solid #16a2fd;">
                          <tbody>
                              <tr>
                                  <td style="text-align:center;padding: 30px 30px 15px 30px;">
                                      <h2 style="font-size: 18px; color: #16a1fd; font-weight: 600; margin: 0;">Reset Password</h2>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="text-align:center;padding: 0 30px 20px">
                                      <p style="margin-bottom: 10px;">Hi ${email},</p>
                                      <p style="margin-bottom: 25px;">Click On The link blow to reset your password.</p>
                                      <a href=${url} style="background-color:#16a1fd;border-radius:4px;color:#ffffff;display:inline-block;font-size:13px;font-weight:600;line-height:44px;text-align:center;text-decoration:none;text-transform: uppercase; padding: 0 25px">Reset Password</a>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="text-align:center;padding: 20px 30px 40px">
                                      <p>If you did not make this request, please contact us or ignore this message.</p>
                                      <p style="margin: 0; font-size: 13px; line-height: 22px; color:#9ea8bb;">This is an automatically generated email please do not reply to this email. If you face any issues, please contact us at  help@pesabase.com</p>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <table style="width:100%;max-width:620px;margin:0 auto;">
                          <tbody>
                              <tr>
                                  <td style="text-align: center; padding:25px 20px 0;">
                                      <p style="font-size: 13px;">Copyright © 2020 Pesabase.</p>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                 </td>
              </tr>
          </table>
      </center>
  </body>
  </html>`;
};

module.exports = {
  getErrorMessage,
  getErrorUnathorized,
  getSuccessMessage,
  getLogger,
  generateHash,
  validPassword,
  transTypeID,
  sendEmail
};
