pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
import "./zkVerifier.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
contract HealthZ is zkVerifier {
    // *** Structs ***

    struct Item {
        address payable buyer;
        address payable seller;
        uint256 price;
        bytes16 infoId;
        bytes16 id;
        uint256 deposit;
        uint256 sellerDeposit;
        uint256 buyerDeposit;
        bool sellerConfirmation;
        bool buyerConfirmation;
        uint256 endTime;
    }
    struct Info {
        address creator;
        bytes16 id;
        // address owner;
        // address contractAddress;
        string detail;
        bytes32 hash;
    }

    // *** Variable ***
    uint16 idMaterial = 0;
    string public purpose = "🛠 Programming Unstoppable Money";

    // *** Mapping ***
     uint16 public infoSize = 0;
    mapping(bytes16 => Info) public infos;
    bytes16[] public infosId;

     uint16 public  itemSize = 0;
    mapping(bytes16 => Item) public items;
    bytes16[] public itemsId;

    // Modifiers
    modifier onlyHospital {
        //require(msg.sender == admin);
        _;
    }

    // Events

    event SetPurpose(address sender, string purpose);
    event newInfoAddedEvent(
        address sender,
        string title,
        address creator,
        bytes16 id,
        // address owner;
        // address contractAddress;
        string detail,
        bytes32 hash
    );

    event newItemEvent();

    constructor() public {
        // uint id = getRandom();
        // what should we do on deploy?
    }

    function setPurpose(string memory newPurpose) public {
        //  console.log(randomId());
        // console.logBytes16(randomId());
        purpose = newPurpose;
        console.log(msg.sender, "set purpose to", purpose);
        emit SetPurpose(msg.sender, purpose);
    }

    // *** Getter Methods ***
    function getInfoByIndex(uint256 i)
        public
        view
        returns (
            address creator,
            bytes16 id,
            // address owner;
            // address contractAddress;
            string memory detail,
            bytes32 hash
        )
    {
        bytes16 infoId = infosId[i];
        return (
            infos[infoId].creator,
            infos[infoId].id,
            infos[infoId].detail,
            infos[infoId].hash
        );
    }

    function getItemByIndex(uint256 i)
        public
        view
        returns (
            address buyer,
            address seller,
            uint256 price,
            bytes16 infoId,
            bytes16 id,
            uint256 deposit,
            uint256 sellerDeposit,
            uint256 buyerDeposit,
            bool sellerConfirmation,
            bool buyerConfirmation,
            uint256 endTime
        )
    {
        bytes16 itemId = itemsId[i];
        return (
            items[itemId].buyer,
            items[itemId].seller,
            items[itemId].price,
            items[itemId].infoId,
            items[itemId].id,
            items[itemId].deposit,
            items[itemId].sellerDeposit,
            items[itemId].buyerDeposit,
            items[itemId].sellerConfirmation,
            items[itemId].buyerConfirmation,
            items[itemId].endTime
        );
    }

    // *** Setter Methods ***

    function newInfo(string memory detail)
        public
        returns (
            bytes16 //TODO new modifier
        )
    {
        // Info storage  i = infos[infoId];
        bytes16 infoId = randomId();
        // console.logBytes16(infoId);
        Info storage i = infos[infoId];
        i.detail = detail;
        i.id = infoId;
        i.creator = msg.sender;
        infosId.push(infoId);
        emit newInfoAddedEvent(msg.sender,"new Info added",i.creator,infoId,detail,i.hash);
        infoSize=infoSize+1;
        return infoId;
    }

    function newItem(
        uint256 price,
        bytes16 infoId,
        uint256 deposit,
        uint256 endTime // Seller must call this function
    )
        public
        returns (
            bytes16 //TODO new modifier
        )
    {
        // Info storage  i = infos[infoId];
        bytes16 itemId = randomId();
        // console.logBytes16(infoId);
        Item storage i = items[itemId];
        //i.detail=detail;
        i.id = itemId;
        i.seller = msg.sender;
        i.price = price;
        i.infoId = infoId;
        i.deposit = deposit;
        i.endTime = endTime * 1 days;

        itemsId.push(itemId);
        itemSize= itemSize+1;
        return itemId;
    }

    function buyerDeposit(bytes16 itemId) public payable {
        require(items[itemId].buyer == address(0x0), "Another buyer accepted");
        items[itemId].buyer = msg.sender;
        require(
            items[itemId].deposit == msg.value,
            " Value is not equal with deposit"
        );
        items[itemId].buyerDeposit = msg.value;
    }

    function sellerDeposit(bytes16 itemId) public payable {
        require(items[itemId].seller == msg.sender, "Another seller accepted");

        require(
            items[itemId].deposit == msg.value,
            " Value is not equal with deposit"
        );
        items[itemId].sellerDeposit = msg.value;
    }

    function sellerConfirmation(bytes16 itemId) public {
        require(items[itemId].seller == msg.sender, "Another seller accepted");

        require(
            items[itemId].deposit == items[itemId].sellerDeposit,
            " Value is not equal with deposit"
        );
        require(
            items[itemId].deposit == items[itemId].buyerDeposit,
            " Value is not equal with deposit"
        );
        items[itemId].sellerConfirmation = true;
    }

    function buyerConfirmation(
        bytes16 itemId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[9] memory input // ,
    ) public returns (bool) {
        require(items[itemId].buyer == msg.sender, "Another buyer accepted");

        require(
            items[itemId].deposit == items[itemId].sellerDeposit,
            " Value is not equal with deposit"
        );
        require(
            items[itemId].deposit == items[itemId].buyerDeposit,
            " Value is not equal with deposit"
        );
        // a = a;
        // ZK Snark Verification is here

        require(verifyTx(a, b, c, input));
        items[itemId].sellerConfirmation = true;
        return true;
    }

    function donePhase(bytes16 itemId) public {
        require(items[itemId].endTime < now);
        if (
            items[itemId].sellerConfirmation && items[itemId].buyerConfirmation
        ) {
            items[itemId].buyer.transfer(items[itemId].deposit);
            items[itemId].seller.transfer(items[itemId].deposit);
        }
    }

    // *** Utility Functions ***
    function randomId() public returns (bytes16) {
        bytes16 rand = bytes16(
            keccak256(abi.encodePacked(msg.sender, incrementIdMaterial()))
            // abi.encodePacked(msg.sender, now, (block.number - 1))
        );
        // console.log('hear');
        // console.logBytes16(rand);
        return rand;
    }

    // * Increment and Get Id
    function incrementIdMaterial() internal returns (uint16) {
        idMaterial = idMaterial + 1;
        return idMaterial;
    }
}
