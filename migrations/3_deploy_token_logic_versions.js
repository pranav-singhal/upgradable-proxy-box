/*
@author Arvind Kalra (github.com/arvindkalra) and Pranav Singhal (github.com/pranav-singhal)
*/

const Token_V0 = artifacts.require("./Token_V0.sol");
const TokenStorage = artifacts.require("./TokenStorage.sol");
const Token_V1 = artifacts.require("./Token_V1.sol");

module.exports = function(deployer, network, accounts) {
    let owner = accounts[0];
    deployer.deploy(Token_V0, TokenStorage.address, {from:owner});
    deployer.deploy(Token_V1, TokenStorage.address, {from:owner});
};
