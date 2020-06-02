// <kesholabsAPI>
/*

Copyright (c) 2020 kesholabs
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/




pragma solidity >=0.4.21 <0.7.0;

contract Kesholabs  {
    
    event LOG1(
        address indexed from,
        uint48 _phoneNumber,
        uint256 _amount,
        bytes32 _id,
        uint256 time
        );

    function query(address _sender, uint48 _phoneNumber, uint256 _amount) external returns(bytes32 _id){
         _id = keccak256(abi.encodePacked(_sender, _phoneNumber, _amount));

         emit LOG1(_sender,_phoneNumber, _amount,_id, now);

         return _id;
    }
}



