const kesholabs = artifacts.require("Kesholabs");
const Rest = artifacts.require("Restv1")

module.exports = function(deployer) {
  deployer.deploy(kesholabs).then(function(){
      return deployer.deploy(Rest ,kesholabs.address,'0xa561131a1C8aC25925FB848bCa45A74aF61e5A38')
  });
};
