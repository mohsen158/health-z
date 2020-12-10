pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract HealthZ {
    // *** Structs ***

    struct ContractItem {
        address owner;
        address contractAddress;
        uint16 version;
    }

    // *** Variable ***
    uint16 idMaterial = 0;
    string public purpose = "🛠 Programming Unstoppable Money";


    // *** Mapping ***
    mapping(bytes32 => ContractItem) public Items;

    // Modifiers
    modifier onlyHospital {
        //require(msg.sender == admin);
        _;
    }

    // Events

    event SetPurpose(address sender, string purpose);


    constructor() public {
        // uint id = getRandom();
        // what should we do on deploy?
    }

    function setPurpose(string memory newPurpose) public {
        //  console.log(randomId());
        
        purpose = newPurpose;
        console.log(msg.sender, "set purpose to", purpose);
        emit SetPurpose(msg.sender, purpose);
    }

    // *** Getter Methods ***

    // *** Setter Methods ***

    // *** Utility Functions ***
    function randomId() public  returns (bytes32) {
        bytes32 rand = keccak256(
            abi.encodePacked(msg.sender, incrementIdMaterial())
            // abi.encodePacked(msg.sender, now, (block.number - 1))
        );
        return rand;
    }

    // * Increment and Get Id
    function incrementIdMaterial() public  returns (uint16) {
        idMaterial = idMaterial + 1;
        return idMaterial;
    }
}
