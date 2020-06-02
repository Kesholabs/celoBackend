pragma solidity >=0.4.21 <0.7.0;

import "./kesholabs.sol";

contract usingKesholabs  {

    Kesholabs kesholabs;

    function Kesholabs_query (address _sender, uint48 _phoneNumber, uint256 _amount) public returns(bytes32 _id){
        return kesholabs.query(_sender,_phoneNumber, _amount);
    }
}