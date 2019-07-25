pragma solidity 0.5.8;

import './ProvableAPI.sol';

contract Restv1 is usingProvable {

    event LogNewProvableQuery(string _description);
    event LogErrorInCallback(string description);
    string public result ;
    
    struct Queuevalues {
        string phoneNumber;
        uint amount;
        bytes32 queryId;
    }
    
    mapping (address=>Queuevalues)public Queuemap;
    mapping (address =>uint256)public balance;
    address[] public queueArray;


    function __callback
    (bytes32 _myid,
    string memory _result, 
    bytes memory _proof) 
    public 
    {
        require(msg.sender == provable_cbAddress());
        result = _result;
        for (uint256 index = 0; index < queueArray.length; index++) {
            if (Queuemap[queueArray[index]].queryId == _myid){
                if (keccak256(abi.encodePacked(_result)) != keccak256(abi.encodePacked("0"))) {
                   uint256 amount = Queuemap[queueArray[index]].amount;
                    balance[queueArray[index]] += amount;
                    delete Queuemap[queueArray[index]];
                    remove(index);
                } else {
                    emit LogErrorInCallback("there was an error that occurred");
                }
                
            }
        }
    }

    function _push
    (string memory _number,
     uint _amount) 
     public 
     payable 
     {
        string memory  amo = uint2str(_amount);
        bytes32 queryId = provable_query("computation",["QmSMmrkvggZPQPJjWsuLMHRnAHcmD4EvkC9tiya6zrrQ2Z",_number,amo]);
        emit LogNewProvableQuery('was sent standing in for an answer');
        Queuevalues storage queue = Queuemap[msg.sender];
       
        address[] storage arr = queueArray;
        queue.phoneNumber = _number;
        queue.amount = _amount;
        queue.queryId = queryId;
        arr.push(msg.sender);
        
    }
    function remove
    (uint index) 
    public 
    {
        for (uint i = index; i < queueArray.length - 1; i++) {
            queueArray[i] = queueArray[i+1];
        }
        queueArray.length--;
    }

}