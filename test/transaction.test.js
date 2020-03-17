const Transaction = require("../contractKit/transaction");

describe("Transaction", () => {
  it("Should take each transaction", () => {
    const deposit = "Deposit";
    const transfer = "Transfer";
    const withdraw = "Withdraw";
    expect(Transaction.setTranstype(deposit)).not.toBeNull();
    expect(Transaction.setTranstype(transfer)).not.toBeNull();
    expect(Transaction.setTranstype(withdraw)).not.toBeNull();
  });

  it("Should deposit Funds", () => {
    const params = "0712345678";
    expect(Transaction.depositFunds(params)).not.toBeNull();
  });

  it("Should transfer Funds", () => {
    const params = "0712345678";
    expect(Transaction.getAccount(params)).not.toBeNull();
  });

  it("Should withdraw funds", () => {
    const params = "0712345678";
    expect(Transaction.getBalances(params)).not.toBeNull();
  });
});
