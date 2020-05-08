const QRCode = require("qrcode");
const Account = require("../contractKit/account");

async function typeOfQRCode(body) {
  let { type, account } = body;
  console.log(type);
  let address = "";
  switch (type.toUpperCase()) {
    case "OWN":
      body.account = `SELF_${account}`;
      address = await Account.createAccount(body);
      //   await generateQRCode(address);
      return address;
    case "MERCHANT":
      body.account = `MERCHANT_${account}`;
      address = await Account.createAccount(body);
      //   await generateQRCode(address);
      return address;
    default:
      return;
  }
}

function generateQRCode(address) {
  QRCode.toString(address, { type: "terminal" }, function (err, url) {
    if (err) throw err;
    console.log(url);
  });
}

module.exports = {
  typeOfQRCode
};
