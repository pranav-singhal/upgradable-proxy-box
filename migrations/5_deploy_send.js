const TokenProxy = artifacts.require("./TokenProxy.sol");
const TokenStorage = artifacts.require("./TokenStorage.sol");

module.exports = function(deployer, network, accounts) {
  TokenStorage.at(TokenStorage.address).then(storage => {
    storage["setProxyContract"](TokenProxy.address).then(x => {
      console.log(x);
    });
  });
};
