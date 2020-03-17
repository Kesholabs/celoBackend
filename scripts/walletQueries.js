const util = require("util");
const UserWallet = require("../models/CeloUserWallet");
const UserWalletLogs = require("../models/CeloUserWalletLogs");
const utility = require("./utilityQueries");

module.exports = {
  createUserWallet: (createUserWallet = async body => {
    console.debug(
      "\n\n ===================== CREATING USERWALLET =======================\n\n"
    );
    console.debug("Body \n", body);
    try {
      const newuserwallet = new UserWallet({
        username: body.username,
        account: body.phone,
        balance: body.balance
      });
      return newuserwallet.save();
    } catch (error) {
      console.error(error);
    }
  }),

  createUserWalletLogs: (createUserWalletLogs = async body => {
    console.debug(
      "\n\n ===================== CREATING USERWALLETLOGS =======================\n\n"
    );
    console.debug("Body \n", body);

    try {
      const userwalletlogs = new UserWalletLogs({
        transID: transID,
        username: body.username,
        account: body.account,
        amount: body.amount,
        balance: newamount,
        transType: body.status,
        accountType: body.payMode
      });

      const savedWalletLogs = await userwalletlogs.save();
      console.debug("USERWALLETLOGS SUCCESSFULLY UPDATED \n");
      return savedWalletLogs;
    } catch (error) {
      console.error(error);
    }
  }),

  updateUserWallet: (updateUserWallet = async body => {
    console.debug(
      "\n\n ===================== UPDATE USERWALLET =======================\n\n"
    );
    console.debug("Account %s Balance %s", body.account, body.balance);
    try {
      let query = {
        account: account
      };
      const updatedWallet = await UserWallet.findOneAndUpdate(
        query,
        {
          $set: {
            balance: body.balance
          }
        },
        {
          new: true
        }
      );

      console.debug("balance updated to %s", body.balance);
      return updatedWallet;
    } catch (error) {
      console.error(error);
    }
  }),

  updateUserWalletLogs: (updateUserWallet = async body => {
    console.debug(
      "\n\n ===================== UPDATE USERWALLETLOGS =======================\n\n"
    );
    try {
      createUserWalletLogs(data);
      return WalletQueries.updateUserWallet(data);
    } catch (error) {
      console.error(error);
    }
  }),

  // QUERY USERWALLET
  fetchUserWallet: (fetchUserWallet = async account => {
    console.debug(
      "\n\n================== FETCHING USERWALLET  ====================\n\n"
    );
    console.debug("Searching userwallet with account %s", account);

    try {
      const query = {
        account: account
      };
      return UserWallet.findOne(query);
    } catch (err) {
      throw err;
    }
  }),
  // QUERY USERWALLETLOGS
  fetchUserWalletLogs: (fetchUserWalletLogs = async account => {
    console.debug(
      "\n\n================== FETCHING USERWALLETLOGS  ====================\n\n"
    );
    console.debug("Searching userwalletlog with account %s", account);

    try {
      const query = {
        account: account
      };
      return UserWalletLogs.find(query);
    } catch (err) {
      throw err;
    }
  })
};
