pragma solidity >=0.4.21 <0.6.0;

import "./Token_V0.sol";

/**
 * @author Arvind Kalra (github.com/arvindkalra) and Pranav Singhal (github.com/pranav-singhal)
**/
contract Token_V1 is Token_V0{

    //    TokenStorage dataStore;

    constructor(address storeAddress) Token_V0(storeAddress) public {}

    function allowance(address owner, address spender) public view returns (uint256) {
        return dataStore.getAllowance(owner, spender);
    }

    function approve(address spender, uint256 value) public returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, dataStore.getAllowance(sender, msg.sender).sub(amount));
        return true;
    }

    function _approve(address owner, address spender, uint256 value) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        dataStore.setAllowance(owner, spender, value);
        emit Approval(owner, spender, value);
    }
}