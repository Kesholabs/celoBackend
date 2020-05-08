const crypto = require("../middleware/crypto");

describe("CRYPTO", () => {
  it("Should encrypt private keys", () => {
    const text = "0xdf0f076778a69aec1e3ec81a7d2c71059c51cd3f770e2c80ba533ab0d1a0a79a";
    const encrypt = crypto.encrypt(text);
    expect(crypto.decrypt(encrypt)).not.toBeNull();
  });
});
