// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SimpleStorage{
  string private message;
  address public owner;

  event MessageChanged(string newMessage);

  constructor(){
    message = "Chainlink Workshop";
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner,"Caller is not the owner");
    _;
  }

  function setMessage(string memory newMessage)public onlyOwner{
    require(bytes(newMessage).length > 0,"Empty strings not allowed");
    message = newMessage;
    emit MessageChanged(newMessage);
  }

  function getMessage() public onlyOwner view returns(string memory){
    return message;
  }
}