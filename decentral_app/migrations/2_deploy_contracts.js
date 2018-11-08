var Upload = artifacts.require("./Upload.sol");
var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  deployer.deploy(Upload);
  deployer.deploy(Election);
};
