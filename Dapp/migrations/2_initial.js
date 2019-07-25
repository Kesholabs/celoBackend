const rest = artifacts.require("Restv1");

module.exports = function(deployer) {
  deployer.deploy(rest);
};
