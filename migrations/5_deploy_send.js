const TokenProxy = artifacts.require("./TokenProxy.sol");
const TokenStorage = artifacts.require("./TokenStorage.sol");
const Token_V0 = artifacts.require("./Token_V0.sol");

module.exports = function(deployer, network, accounts) {
  TokenStorage.at(TokenStorage.address).then(storage => {
    storage["setProxyContract"](TokenProxy.address).then(() => {
      Token_V0.at(TokenProxy.address).then(v0 => {
        v0["setInitials"](1000).then(() => {});
      });
    });
  });
};
