pragma solidity >=0.4.21 <0.6.0;

import "./TokenStorage.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";
import './Ownable.sol';

/**
* @author Arvind Kalra (github.com/arvindkalra) and Pranav Singhal (github.com/pranav-singhal)
* @title Token_V0
* @notice A basic ERC20 token with modular data storage
*/
contract Token_V0 is Ownable {
    using SafeMath for uint256;

    /** Events */
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    TokenStorage dataStore;

    constructor(address storeAddress) public {
        dataStore = TokenStorage(storeAddress);
    }

    /** Modifiers **/

    /** Functions **/

    function setInitials(uint256 totalSupply) onlyOwner public{
        require(dataStore.getTotalSupply() == 0, "Total Supply Already Set");
        dataStore.addBalance(msg.sender, totalSupply);
        dataStore.setTotalSupply(totalSupply);
    }

    function totalSupply() public view returns(uint256) {
        return(dataStore.getTotalSupply());
    }

    function balanceOf(address account) public view returns (uint256) {
        return dataStore.getBalance(account);
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        dataStore.subBalance(sender, amount);
        dataStore.addBalance(recipient, amount);
        emit Transfer(sender, recipient, amount);
    }
}