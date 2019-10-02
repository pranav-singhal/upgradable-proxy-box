const TokenProxy = artifacts.require("./TokenProxy.sol");
const Token_V0 = artifacts.require("./Token_V0.sol");
const TokenStorage = artifacts.require("./TokenStorage.sol");

module.exports = function(deployer, network, accounts) {
  let owner = accounts[0];
  deployer.deploy(TokenProxy, Token_V0.address, TokenStorage.address, {
    from: owner
  });
};
